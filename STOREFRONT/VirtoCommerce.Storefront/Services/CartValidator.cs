﻿using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.Client.Api;
using VirtoCommerce.Storefront.Converters;
using VirtoCommerce.Storefront.Model;
using VirtoCommerce.Storefront.Model.Cart;
using VirtoCommerce.Storefront.Model.Cart.Services;
using VirtoCommerce.Storefront.Model.Cart.ValidationErrors;
using VirtoCommerce.Storefront.Model.Catalog;
using VirtoCommerce.Storefront.Model.Services;

namespace VirtoCommerce.Storefront.Services
{
    public class CartValidator : ICartValidator
    {
        private readonly WorkContext _workContext;
        private readonly IShoppingCartModuleApi _cartApi;
        private readonly ICatalogSearchService _catalogService;

        public CartValidator(WorkContext workContext, IShoppingCartModuleApi cartApi, ICatalogSearchService catalogService)
        {
            _workContext = workContext;
            _cartApi = cartApi;
            _catalogService = catalogService;
        }

        public async Task ValidateAsync(ShoppingCart cart)
        {
            if (cart.IsTransient())
            {
                return;
            }
            await Task.WhenAll(ValidateItemsAsync(cart), ValidateShipmentsAsync(cart), ValidateCartAsync(cart));
        }

        private async Task ValidateItemsAsync(ShoppingCart cart)
        {
            var productIds = cart.Items.Select(i => i.ProductId).ToArray();
            var products = await _catalogService.GetProductsAsync(productIds, ItemResponseGroup.ItemLarge);
            foreach (var lineItem in cart.Items)
            {
                var product = products.FirstOrDefault(x => x.Id == lineItem.ProductId);

                lineItem.ValidationErrors.Clear();
                if (product == null || (product != null && (!product.IsActive || !product.IsBuyable)))
                {
                    lineItem.ValidationErrors.Add(new ProductUnavailableError());
                }
                else if (product != null)
                {
                    if (product.TrackInventory && product.Inventory != null)
                    {
                        var availableQuantity = product.Inventory.InStockQuantity;
                        if (product.Inventory.ReservedQuantity.HasValue)
                        {
                            availableQuantity -= product.Inventory.ReservedQuantity.Value;
                        }
                        if (availableQuantity.HasValue && lineItem.Quantity > availableQuantity.Value)
                        {
                            lineItem.ValidationErrors.Add(new ProductQuantityError(availableQuantity.Value));
                        }
                    }

                    if (lineItem.PlacedPrice != product.Price.ActualPrice)
                    {
                        lineItem.ValidationErrors.Add(new ProductPriceError(product.Price.ActualPrice));
                    }
                }
            }
        }

        private async Task ValidateShipmentsAsync(ShoppingCart cart)
        {
            foreach (var shipment in cart.Shipments)
            {
                shipment.ValidationErrors.Clear();

                var availableShippingMethods = await _cartApi.CartModuleGetShipmentMethodsAsync(_workContext.CurrentCart.Id);
                var existingShippingMethod = availableShippingMethods.FirstOrDefault(sm => sm.ShipmentMethodCode == shipment.ShipmentMethodCode);
                if (existingShippingMethod == null)
                {
                    shipment.ValidationErrors.Add(new ShippingUnavailableError());
                }
                if (existingShippingMethod != null)
                {
                    var shippingMethod = existingShippingMethod.ToWebModel(_workContext.AllCurrencies, _workContext.CurrentLanguage);
                    if (shippingMethod.Price != shipment.ShippingPrice)
                    {
                        shipment.ValidationErrors.Add(new ShippingPriceError(shippingMethod.Price));
                    }
                }
            }
        }

        private async Task ValidateCartAsync(ShoppingCart cart)
        {
            cart.ValidationErrors.Clear();

            var actualCart = await _cartApi.CartModuleGetCartByIdAsync(_workContext.CurrentCart.Id);
            var actualSubtotal = actualCart.SubTotal.HasValue ? (decimal)actualCart.SubTotal.Value : 0;

            if (_workContext.CurrentCart.SubTotal.Amount != actualSubtotal)
            {
                cart.ValidationErrors.Add(new CartSubtotalError());
            }
        }
    }
}
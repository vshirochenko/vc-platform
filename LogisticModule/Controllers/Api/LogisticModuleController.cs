using System.Web.Http;

namespace LogisticModule.Controllers.Api
{
    [RoutePrefix("api/LogisticModule")]
    public class ManagedModuleController : ApiController
    {
        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            return Ok(new { result = "Hello world!" });
        }
    }
}

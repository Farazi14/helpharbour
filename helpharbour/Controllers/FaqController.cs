using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;


namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaqController : ControllerBase
    {
        private readonly faqDAO _faqDAO; // Injected FaqDAO
        private readonly ILogger<UserAccountController> _logger;


        public FaqController(faqDAO faqDAO, ILogger<UserAccountController> logger)
        {
            _faqDAO = faqDAO; // Initialize FaqDAO
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<faq>> Get()
        {
            _logger.LogInformation("Get all faqs");

            try
            {
                var faqs = _faqDAO.GetAllFaqs();
                return Ok(faqs); // Return the faqs with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to get a faq by ID
        [HttpGet("{faqID}")]
        public ActionResult<faq> Get(int faqID)
        {
            try
            {
                var faq = _faqDAO.GetFaqById(faqID);
                if (faq == null)
                {
                    return NotFound(); // Return HTTP 404 Not Found if faq is not found
                }
                return Ok(faq); // successful response with the faq
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to add a faq
        [HttpPost("addfaq")]
        public ActionResult<faq> Post([FromBody] faq newFaq)
        {
            _logger.LogInformation("Adding a new faq: {AuthorID} ", newFaq.authorID);
            try
            {
                var create_Faq = _faqDAO.AddFaq(newFaq);
                return Ok(create_Faq); // Return the created faq with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to update a faq
        [HttpPut("{faqID}")]
        public ActionResult<faq> Put(int faqID, [FromBody] faq faq)
        {
            try
            {
                _faqDAO.UpdateFaq(faqID, faq);
                return Ok(faq); // Return the updated faq with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to delete a faq
        [HttpDelete("{faqID}")]
        public ActionResult Delete(int faqID)
        {
            try
            {
                _faqDAO.DeleteFaq(faqID);
                return Ok(); // Return HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

    }
  
}

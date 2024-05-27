using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;


namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentDAO _commentDAO;                                                // Injected CommentDAO
        private readonly ILogger<UserAccountController> _logger;                                // defining logger to track api operations
        public CommentController(CommentDAO commentDAO, ILogger<UserAccountController> logger)
        {
            _commentDAO = commentDAO; // Initialize CommentDAO
            _logger = logger; // adding logger in the constructor to api operations
        }

        // Implementation to add a comment
        [HttpPost]
        public ActionResult<Comment> Post([FromBody] Comment newComment)
        {
            try
            {
                _logger.LogInformation("Adding a new comment method called");
                var create_Comment = _commentDAO.AddComment(newComment);
                return Ok(create_Comment);                                                      // Return the created comment with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");                                // Handle exceptions gracefully
            }
        }

              

        // Implementation to get all comments for a ticket by ticketID
        [HttpGet("ticket/{ticketID}")]
        public ActionResult<List<Comment>> GetCommentsByTicketId(int ticketId)
        {
            var comments = _commentDAO.GetCommentsByTicketID(ticketId);
            if (comments == null || comments.Count == 0)
            {
                return NotFound("No comments found for this ticket.");
            }
            return comments;
        }
    }
}

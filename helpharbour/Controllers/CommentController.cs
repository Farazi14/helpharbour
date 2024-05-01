using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;


namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentDAO _commentDAO; // Injected CommentDAO
        private readonly ILogger<UserAccountController> _logger; // defining logger to track api operations
        public CommentController(CommentDAO commentDAO, ILogger<UserAccountController> logger)
        {
            _commentDAO = commentDAO; // Initialize CommentDAO
            _logger = logger; // adding logger in the constructor to api operations
        }


        [HttpGet]
        public ActionResult<IEnumerable<Comment>> Get()
        {
            try
            {
                var comments = _commentDAO.GetAllComments();
                return Ok(comments); // Return the comments with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to get a comment by ID
        [HttpGet("{commentID}")]
        public ActionResult<Comment> Get(int commentID)
        {
            try
            {
                var comment = _commentDAO.GetCommentById(commentID);
                if (comment == null)
                {
                    return NotFound(); // Return HTTP 404 Not Found if comment is not found
                }
                return Ok(comment); // successful response with the comment
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to add a comment
        [HttpPost]
        public ActionResult<Comment> Post([FromBody] Comment newComment)
        {
            try
            {
                _logger.LogInformation("Adding a new comment method called");
                var create_Comment = _commentDAO.AddComment(newComment);
                return Ok(create_Comment); // Return the created comment with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to update a comment
        [HttpPut("{commentID}")]
        public ActionResult Put(int commentID, [FromBody] Comment comment)
        {
            try
            {
                _commentDAO.UpdateComment(commentID, comment);
                return Ok(); // Return HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
            }
        }

        // Implementation to delete a comment
        [HttpDelete("{commentID}")]
        public ActionResult Delete(int commentID)
        {
            try
            {
                _commentDAO.DeleteComment(commentID);
                return Ok(); // Return HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // Handle exceptions gracefully
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

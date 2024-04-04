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
        public CommentController(CommentDAO commentDAO)
        {
            _commentDAO = commentDAO; // Initialize CommentDAO
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
    }
}

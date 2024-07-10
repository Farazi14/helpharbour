using helpharbour.DAO;
using helpharbour.Model;
using Microsoft.AspNetCore.Mvc;


namespace helpharbour.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly TicketDAO _ticketDAO;                                                  // Injected TicketDAO
        private readonly ILogger<UserAccountController> _logger;

        // Adjust the constructor to include TicketDAO
        public TicketController(TicketDAO ticketDAO, ILogger<UserAccountController> logger)
        {
            _ticketDAO = ticketDAO;                                                             // Initialize TicketDAO
            _logger = logger;                                                                   // adding logger to track ticket operations
        }

        [HttpGet]
        public ActionResult<IEnumerable<ticket>> Get()                                          // Ensure the return type matches your model because of <ticket> in the ActionResult
        {
            try
            {
                var tickets = _ticketDAO.GetAllTickets();
                return Ok(tickets);                                                             // Return the tickets with HTTP 200 OK
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");                                // Handle exceptions gracefully
            }
        }

        // Implementation to get a ticket by ID
        [HttpGet("{ticketId}")]
        public ActionResult<ticket> Get(int ticketId)
        {
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound();                                                          // Return HTTP 404 Not Found if ticket is not found
                }
                return Ok(ticket);                                                              // successful response with the ticket
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");                                // Handle exceptions gracefully
            }
        }


        // Implementation to add a ticket
        [HttpPost]
        public ActionResult<ticket> Post([FromBody] ticket newTicket)
        {
            
            try
            {
                var create_Ticket = _ticketDAO.AddTicket(newTicket);
                return CreatedAtAction(nameof(Get), new { id = create_Ticket.ticketID }, create_Ticket); 
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to update a ticket modified to update only the status
        [HttpPut("{ticketId}/status")]
        public ActionResult<ticket> UpdateTicketStatus(int ticketId, [FromBody] TicketStatusUpdate updateStatus)
        {
            
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound();
                }
                //updatedTicket.ticketID = ticketId;  

                ticket.status = updateStatus.status;                                                // Update only the status
                var updatedTicket = _ticketDAO.UpdateTicket(ticketId, ticket);
                return Ok(updatedTicket); 
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to delete a ticket
        [HttpDelete("{ticketId}")]
        public ActionResult Delete(int ticketId)
        {
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound(); 
                }
                _ticketDAO.DeleteTicket(ticketId);
                return NoContent();                                                                   // Return HTTP 204 No Content
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); 
            }
        }

        // Implementation to get all tickets by a user
        [HttpGet("user/{userId}")]
                public ActionResult<List<ticket>> GetTicketsByUserId(string userId)
        {
            try
            {
                var tickets = _ticketDAO.GetTicketsByUserId(userId);
                if (tickets == null) return NotFound("No tickets found for the user.");
                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // Implementation to get all tickets assigned to a user
        [HttpGet("assigned/{userId}")]
        public ActionResult<List<ticket>> GetTicketsByAssignee(string userId)
        {
            try
            {
                var tickets = _ticketDAO.GetTicketsByAssignee(userId);
                if (tickets == null) return NotFound("No tickets assigned to the user.");
                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        //implementation to update the assigned user of a ticket
        [HttpPut("{ticketId}/assign")]
        public ActionResult AssignTicket(int ticketId, [FromBody] TicketAssignmentUpdate assignee)
        {
            _logger.LogInformation($"AssignTicket method is called with assignee: {assignee.Assigned}, {assignee.status} "); // printing the assignee and status values on the console
            try
            {
                var ticket = _ticketDAO.GetTicketById(ticketId);
                if (ticket == null)
                {
                    return NotFound("Ticket not found.");
                }

                ticket.assigned = assignee.Assigned;
                ticket.status = assignee.status;                                                                            // Update the status
                
                _ticketDAO.UpdateTicket(ticketId, ticket);

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to reassign ticket.");
                return StatusCode(500, "Internal server error");
            }
        }

        //implementation to get all statuses
        [HttpGet("allstatus")]
        public ActionResult<IEnumerable<string>> GetAllStatuses()
        {

            _logger.LogInformation("GetAllStatuses method is called");
            try
            {
                var statuses = _ticketDAO.GetAllStatuses();                                                                 // calling Get all statuses method from DAO
                if (statuses == null || !statuses.Any())                                                                    // check if the statuses are null or empty
                {
                    return NotFound("No statuses found.");
                }
                return Ok(statuses);
            }
            catch (Exception ex) { // catch the exception if any            
                _logger.LogError(ex, "Failed to display statuses.");
                return StatusCode(500, "Internal server error");
            }
        }
        
        //implementation to get tickets by status
        [HttpGet("bystatus/{status}")]
        public ActionResult<IEnumerable<ticket>> GetTicketsByStatus(string status)
        {
            try
            {
                var tickets = _ticketDAO.GetTicketsByStatus(status);                                                        // calling GetTicketsByStatus method from DAO and passing the status
                if (tickets == null || !tickets.Any())
                    return NotFound("No tickets found with the specified status.");

                return Ok(tickets);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch tickets by status.");
                return StatusCode(500, "Internal server error");
            }
        }

        //implementation to get ticket counts by status for a user
        [HttpGet("user/{userId}/status-counts")]
        public ActionResult GetTicketCountsByStatusForUser(string userId)
        {

            _logger.LogInformation("GetTicketCountsByStatusForUser method is called, {userID} ", userId);                  
            try
            {
                var ticketCounts = _ticketDAO.GetTicketCountsByStatusForUser(userId);
                if (ticketCounts == null || !ticketCounts.Any())
                    return NotFound("No ticket status counts found for the user.");
                    
                return Ok(new                                                                                               // return the ticket counts by status for the user 
                {
                    assignedCount = ticketCounts.GetValueOrDefault("Assigned", 0),                                          // get the assigned count from the dictionary and if not found then return 0
                    unassignedCount = ticketCounts.GetValueOrDefault("Unassigned", 0),                                      // get the unassigned count from the dictionary and if not found then return 0
                    resolvedCount = ticketCounts.GetValueOrDefault("Resolved", 0)                                           // get the resolved count from the dictionary and if not found then return 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch ticket status counts.");
                return StatusCode(500, "Internal server error");
            }
        }

        //implementation to get ticket counts by status for a user
        [HttpGet("user/{userId}/assign-counts")]
        public ActionResult GetAssignedCountsByStatusForUser(string userId)
        {

            _logger.LogInformation("GetAssignedCountsByStatusForUser method is called, {userID} ", userId);
            try
            {
                var ticketCounts = _ticketDAO.GetAssignedCountsByStatusForUser(userId);
                if (ticketCounts == null || !ticketCounts.Any())
                    return NotFound("No ticket status counts found for the user.");

                return Ok(new                                                                                               // return the ticket counts by status for the user 
                {
                    assignedCount = ticketCounts.GetValueOrDefault("Assigned", 0),                                          // get the assigned count from the dictionary and if not found then return 0
                    openCount = ticketCounts.GetValueOrDefault("Open", 0),                                      // get the unassigned count from the dictionary and if not found then return 0
                    closeCount = ticketCounts.GetValueOrDefault("Close", 0)                                           // get the resolved count from the dictionary and if not found then return 0
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch ticket status counts.");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}

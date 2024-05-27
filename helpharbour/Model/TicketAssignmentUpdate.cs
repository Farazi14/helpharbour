namespace helpharbour.Model
{
    public class TicketAssignmentUpdate              // Inheriting from the TicketAssignment class in order to use its properties
    {

        public string Assigned { get; set; }         // Adding Assigned property to the TicketAssignmentUpdate class in order to receive corresponding value from the client
        public string status { get; set; }           // Adding status property to the TicketAssignmentUpdate class in order to receive corresponding value from the client
    }
}

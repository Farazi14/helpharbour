namespace helpharbour.Model
{
    public class TicketStatusUpdate                   // Inheriting from the Ticket class in order to use its properties
    {
        public string status { get; set; }           // Adding status property to the TicketStatusUpdate class in order to receive corresponding value from the client
    }
}

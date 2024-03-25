using System;
using MongoDB.Driver;

namespace helpharbour.Services
{
    public class MongoDBConnection
    {

        // Database connection variable
        private readonly IMongoDatabase database;

        // Constructor for database connection
        public MongoDBConnection(IConfiguration configuration)
        {
            var connectionString = configuration["MONGODB_URI"];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("MONGODB_URI is not configured.");
            }

            var client = new MongoClient(connectionString);
            database = client.GetDatabase("helpharbourDB");
        }

        // Method to get the database
        public IMongoDatabase GetDatabase()
        {
            return database;
        }
    }
}

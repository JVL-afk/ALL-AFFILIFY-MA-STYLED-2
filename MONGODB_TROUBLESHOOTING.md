# MongoDB Connection Troubleshooting Guide

## Diagnostic Tools

I've added three diagnostic API endpoints to help troubleshoot MongoDB connection issues:

1. **DNS Test**: `/api/dns-test`
   - Tests DNS resolution for the MongoDB hostname
   - Verifies SRV records for MongoDB+SRV connections
   - Shows IP addresses for the MongoDB server

2. **Raw DB Test**: `/api/raw-db-test`
   - Tests direct connection to MongoDB using the raw driver
   - Bypasses the application's connection module
   - Provides detailed error information

3. **Connection Test**: `/api/test-db-connection`
   - Tests the application's MongoDB connection module
   - Lists available collections
   - Shows database connection details

## Common Issues and Solutions

### 1. Connection Timeout

**Symptoms**:
- Error message: `MongoServerSelectionError: connect ETIMEDOUT`
- Connection attempts take a long time before failing

**Possible Causes**:
- Firewall blocking MongoDB port (27017)
- MongoDB server is down or unreachable
- Network connectivity issues

**Solutions**:
- Check if MongoDB Atlas is accessible from your deployment environment
- Verify IP whitelisting in MongoDB Atlas Network Access settings
- Try direct connection to the MongoDB server IP

### 2. Authentication Failed

**Symptoms**:
- Error message: `MongoServerError: Authentication failed`
- Connection is established but credentials are rejected

**Possible Causes**:
- Incorrect username or password
- User doesn't have access to the specified database
- Missing `authSource` parameter

**Solutions**:
- Verify username and password in connection string
- Add `?authSource=admin` to the connection string
- Check user permissions in MongoDB Atlas

### 3. DNS Resolution Issues

**Symptoms**:
- Error message: `MongooseServerSelectionError: getaddrinfo ENOTFOUND`
- DNS test endpoint shows errors

**Possible Causes**:
- Invalid hostname in connection string
- DNS resolution issues in deployment environment

**Solutions**:
- Use IP address directly instead of hostname
- Check DNS configuration in deployment environment

### 4. Connection String Format

**Symptoms**:
- Error message: `Invalid connection string`
- Connection fails immediately

**Possible Causes**:
- Malformed connection string
- Using wrong connection string format

**Solutions**:
- Try different connection string formats:
  - Standard: `mongodb://username:password@hostname:port/database?authSource=admin`
  - SRV: `mongodb+srv://username:password@hostname/database?retryWrites=true&w=majority`
  - Direct IP: `mongodb://username:password@ip-address:port/database?authSource=admin`

## Environment-Specific Settings

### Vercel

For Vercel deployments:
1. Go to your project settings
2. Navigate to Environment Variables
3. Update the `MONGODB_URI` variable with the correct connection string
4. Redeploy your application

### MongoDB Atlas

In MongoDB Atlas:
1. Ensure Network Access allows connections from your deployment environment
   - For testing, you can temporarily allow access from anywhere (0.0.0.0/0)
   - For production, restrict to specific IP addresses
2. Verify Database Access user has the correct permissions
   - At minimum, readWrite role on the database
3. Check if the cluster is active and healthy

## Testing Connection Locally

To test your MongoDB connection locally:

```bash
# Install MongoDB CLI tools
npm install -g mongodb-cli

# Test connection with connection string
mongosh "your-connection-string"
```

If the connection works locally but fails in production, the issue is likely related to network access or environment configuration.

## Next Steps

If you're still experiencing issues after trying these solutions:

1. Check the logs in your deployment platform for detailed error messages
2. Try connecting with a MongoDB client tool to verify credentials
3. Contact MongoDB Atlas support if you suspect an issue with the database service

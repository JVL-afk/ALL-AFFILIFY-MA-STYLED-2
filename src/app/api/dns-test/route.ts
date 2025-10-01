import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

// Promisify DNS functions
const resolveSrv = promisify(dns.resolveSrv);
const resolve4 = promisify(dns.resolve4);
const lookup = promisify(dns.lookup);

export async function GET() {
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MONGODB_URI environment variable is not set' 
      }, { status: 500 });
    }

    // Extract hostname from URI
    let hostname = '';
    try {
      const url = new URL(uri);
      hostname = url.hostname;
    } catch (error) {
      console.error('Failed to parse URI:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse MongoDB URI',
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }

    console.log('DNS Test - Testing hostname:', hostname);
    
    // Results object
    const results: any = {
      hostname,
      lookupResult: null,
      ipAddresses: null,
      srvRecords: null,
      errors: {}
    };

    // Test 1: Basic DNS lookup
    try {
      console.log('DNS Test - Performing basic lookup...');
      const lookupResult = await lookup(hostname);
      results.lookupResult = lookupResult;
      console.log('DNS Test - Lookup result:', lookupResult);
    } catch (error) {
      console.error('DNS Test - Lookup failed:', error);
      results.errors.lookup = error instanceof Error ? error.message : String(error);
    }

    // Test 2: Resolve IP addresses
    try {
      console.log('DNS Test - Resolving IP addresses...');
      const ipAddresses = await resolve4(hostname);
      results.ipAddresses = ipAddresses;
      console.log('DNS Test - IP addresses:', ipAddresses);
    } catch (error) {
      console.error('DNS Test - IP resolution failed:', error);
      results.errors.resolve = error instanceof Error ? error.message : String(error);
    }

    // Test 3: SRV record resolution (for MongoDB+SRV)
    if (uri.startsWith('mongodb+srv://')) {
      try {
        console.log('DNS Test - Resolving SRV records...');
        const srvHostname = `_mongodb._tcp.${hostname}`;
        const srvRecords = await resolveSrv(srvHostname);
        results.srvRecords = srvRecords;
        console.log('DNS Test - SRV records:', srvRecords);
      } catch (error) {
        console.error('DNS Test - SRV resolution failed:', error);
        results.errors.srv = error instanceof Error ? error.message : String(error);
      }
    }

    // Return results
    return NextResponse.json({
      success: Object.keys(results.errors).length === 0,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('DNS Test - Unexpected error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'DNS test failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

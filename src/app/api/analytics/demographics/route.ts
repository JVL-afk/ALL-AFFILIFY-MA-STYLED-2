import { NextRequest, NextResponse } from 'next/server';
import { googleAnalytics } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const data = await googleAnalytics.getDemographicsData(startDate, endDate);
    
    // Process age demographics
    const ageData = data.rows
      .filter(row => row.dimensionValues[0]?.name === 'userAgeBracket')
      .map(row => ({
        age: row.dimensionValues[0]?.value || 'Unknown',
        users: parseInt(row.metricValues[0]?.value || '0'),
      }))
      .sort((a, b) => b.users - a.users);

    // Process gender demographics
    const genderData = data.rows
      .filter(row => row.dimensionValues[0]?.name === 'userGender')
      .map(row => ({
        gender: row.dimensionValues[0]?.value || 'Unknown',
        users: parseInt(row.metricValues[0]?.value || '0'),
      }))
      .sort((a, b) => b.users - a.users);

    // Process country demographics
    const countryData = data.rows
      .filter(row => row.dimensionValues[0]?.name === 'country')
      .map(row => ({
        country: row.dimensionValues[0]?.value || 'Unknown',
        users: parseInt(row.metricValues[0]?.value || '0'),
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10); // Top 10 countries

    const totalUsers = ageData.reduce((sum, item) => sum + item.users, 0) ||
                      genderData.reduce((sum, item) => sum + item.users, 0) ||
                      countryData.reduce((sum, item) => sum + item.users, 0);

    // Calculate percentages
    const agePercentages = ageData.map(item => ({
      ...item,
      percentage: totalUsers > 0 ? (item.users / totalUsers) * 100 : 0,
    }));

    const genderPercentages = genderData.map(item => ({
      ...item,
      percentage: totalUsers > 0 ? (item.users / totalUsers) * 100 : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        age: agePercentages,
        gender: genderPercentages,
        countries: countryData,
        totalUsers,
        period: { startDate, endDate },
      },
    });
  } catch (error) {
    console.error('Error fetching demographics analytics:', error);
    
    // Return mock data on error
    const mockDemographicsData = {
      age: [
        { age: '25-34', users: 450, percentage: 35.2 },
        { age: '35-44', users: 320, percentage: 25.0 },
        { age: '18-24', users: 280, percentage: 21.9 },
        { age: '45-54', users: 150, percentage: 11.7 },
        { age: '55-64', users: 80, percentage: 6.2 },
      ],
      gender: [
        { gender: 'male', users: 680, percentage: 53.1 },
        { gender: 'female', users: 600, percentage: 46.9 },
      ],
      countries: [
        { country: 'United States', users: 420 },
        { country: 'Romania', users: 280 },
        { country: 'Germany', users: 180 },
        { country: 'United Kingdom', users: 150 },
        { country: 'Canada', users: 120 },
      ],
      totalUsers: 1280,
    };

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch demographics analytics data',
      data: {
        ...mockDemographicsData,
        period: { startDate: '30daysAgo', endDate: 'today' },
      },
    });
  }
}


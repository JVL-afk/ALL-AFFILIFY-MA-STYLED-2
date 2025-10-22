"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Plus, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react'

interface Website {
  id: string
  title: string
  url: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
}

export function MyWebsites() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWebsites = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/websites')
      const data = await response.json()

      if (data.success) {
        setWebsites(data.websites)
      } else {
        setError(data.error || 'Failed to fetch websites.')
        setWebsites([])
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('An unexpected error occurred while fetching data.')
      setWebsites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWebsites()
  }, [])

  const totalWebsites = websites.length
  const totalViews = 0 // Mock for now
  const totalClicks = 0 // Mock for now
  const totalRevenue = 0 // Mock for now

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Websites</h1>
        <Button onClick={() => window.location.href = '/dashboard/create-website'}>
          <Plus className="mr-2 h-4 w-4" /> Create New Website
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWebsites}</div>
            <p className="text-xs text-muted-foreground">
              {websites.filter(w => w.status === 'published').length} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all websites
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              0.00% CTR
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              $0.00 per click
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Website List</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchWebsites} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 p-4">
              Error: {error}
            </div>
          )}
          {!loading && websites.length === 0 && !error && (
            <div className="text-center p-4">
              <p className="text-lg font-medium">No websites yet.</p>
              <p className="text-muted-foreground">Get started by creating your first affiliate website.</p>
            </div>
          )}
          {!loading && websites.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">{website.title}</TableCell>
                    <TableCell>
                      {website.url ? (
                        <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-xs block">
                          {website.url}
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        website.status === 'published' ? 'bg-green-100 text-green-800' :
                        website.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      `}>
                        {website.status ? website.status.charAt(0).toUpperCase() + website.status.slice(1) : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(website.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => website.url && window.open(website.url, '_blank')} disabled={!website.url}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => console.log('Edit', website.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => console.log('Delete', website.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


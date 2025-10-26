const fs = require('fs')
const path = require('path')

const dashboardDir = path.join(__dirname, '../src/app/dashboard')
const outputFile = path.join(__dirname, '../src/lib/default-dashboard-files.json')

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      // Only include TypeScript and TSX files
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const relativePath = path.relative(path.join(__dirname, '../src'), filePath)
        const content = fs.readFileSync(filePath, 'utf8')
        
        arrayOfFiles.push({
          path: `src/${relativePath}`,
          content: content,
          lastModified: new Date().toISOString()
        })
      }
    }
  })

  return arrayOfFiles
}

// Extract all dashboard files
const dashboardFiles = getAllFiles(dashboardDir)

// Save to JSON file
fs.writeFileSync(outputFile, JSON.stringify(dashboardFiles, null, 2))

console.log(`✅ Extracted ${dashboardFiles.length} dashboard files to ${outputFile}`)


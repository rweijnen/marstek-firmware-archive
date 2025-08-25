#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function formatFileSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function findFirmwareFiles(dir = './firmwares') {
  const firmwares = [];
  
  function scanDirectory(currentDir, deviceType = null, firmwareType = null) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (!deviceType) {
          // This is the device type level
          scanDirectory(fullPath, entry.name);
        } else if (!firmwareType && !entry.name.match(/^\d/)) {
          // This might be firmware type level (if not starting with digit)
          scanDirectory(fullPath, deviceType, entry.name);
        } else {
          // This is version level
          const version = entry.name;
          const metadataPath = path.join(fullPath, 'metadata.json');
          
          if (fs.existsSync(metadataPath)) {
            try {
              const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
              const binaryPath = path.join(fullPath, metadata.archivedFilename);
              
              firmwares.push({
                deviceType: deviceType,
                firmwareType: firmwareType,
                version: version,
                filename: metadata.archivedFilename,
                filesize: metadata.archivedFilesize,
                archivedAt: metadata.archivedAt,
                issueNumber: metadata.issueNumber,
                description: metadata.english || metadata.chinese || metadata.remark || '',
                relativePath: path.relative('.', binaryPath).replace(/\\/g, '/'),
                metadataPath: path.relative('.', metadataPath).replace(/\\/g, '/')
              });
            } catch (error) {
              console.error(`Error parsing metadata: ${metadataPath}`, error);
            }
          }
        }
      }
    }
  }
  
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
  
  return firmwares;
}

function generateReadme() {
  const firmwares = findFirmwareFiles();
  
  // Group by device type
  const deviceGroups = {};
  firmwares.forEach(fw => {
    if (!deviceGroups[fw.deviceType]) {
      deviceGroups[fw.deviceType] = {};
    }
    
    const typeKey = fw.firmwareType || 'Firmware';
    if (!deviceGroups[fw.deviceType][typeKey]) {
      deviceGroups[fw.deviceType][typeKey] = [];
    }
    
    deviceGroups[fw.deviceType][typeKey].push(fw);
  });

  // Sort everything
  const sortedDevices = Object.keys(deviceGroups).sort();
  sortedDevices.forEach(device => {
    const types = Object.keys(deviceGroups[device]).sort();
    types.forEach(type => {
      deviceGroups[device][type].sort((a, b) => {
        // Sort by version number (descending)
        const aVer = parseInt(a.version) || 0;
        const bVer = parseInt(b.version) || 0;
        return bVer - aVer;
      });
    });
  });

  let readme = `# Marstek Firmware Archive

Community firmware archive for Marstek solar/battery devices.

## Available Firmware

`;

  if (firmwares.length === 0) {
    readme += "No firmware files found in the archive yet.\n\n";
  } else {
    let totalCount = 0;
    
    sortedDevices.forEach(deviceType => {
      readme += `### ${deviceType}\n\n`;
      
      const types = Object.keys(deviceGroups[deviceType]).sort();
      types.forEach(firmwareType => {
        if (types.length > 1) {
          readme += `#### ${firmwareType}\n\n`;
        }
        
        readme += "| Version | File Size | Added | Download | Issue | Description |\n";
        readme += "|---------|-----------|-------|----------|-------|-------------|\n";
        
        deviceGroups[deviceType][firmwareType].forEach(fw => {
          const description = fw.description.length > 80 
            ? fw.description.substring(0, 80) + '...' 
            : fw.description;
          
          const issueLink = fw.issueNumber ? `[#${fw.issueNumber}](../../issues/${fw.issueNumber})` : '-';
          
          readme += `| v${fw.version} | ${formatFileSize(fw.filesize)} | ${formatDate(fw.archivedAt)} | [📁 ${fw.filename}](${fw.relativePath}) | ${issueLink} | ${description.replace(/\|/g, '\\|').replace(/\n/g, ' ')} |\n`;
          totalCount++;
        });
        
        readme += "\n";
      });
    });
    
    readme += `---\n\n**Total firmware files:** ${totalCount}\n`;
    readme += `**Last updated:** ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n\n`;
  }

  readme += `## Usage

1. Browse the firmware table above to find your device type and desired version
2. Click the download link to get the binary file
3. Use your device's firmware update mechanism to install

## Contributing

This archive is automatically maintained. Firmware submissions are processed via GitHub Issues with the \`firmware-submission\` label.

## Archive Structure

- **Standard devices** (HMG-50): \`firmwares/[device]/[type]/[version]/\`
- **HME devices** (HME-3, HME-4): \`firmwares/[device]/[version]/\`

Each firmware directory contains:
- Binary firmware file
- \`metadata.json\` with submission details and checksums
`;

  return readme;
}

// Generate and write README
const readmeContent = generateReadme();
fs.writeFileSync('README.md', readmeContent);
console.log('README.md updated successfully');
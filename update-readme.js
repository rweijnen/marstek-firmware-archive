#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Remove translation function - we'll use inline popup instead

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
                deviceType: metadata.deviceType || deviceType, // Use metadata deviceType if available
                firmwareType: firmwareType,
                version: version,
                filename: metadata.archivedFilename,
                filesize: metadata.archivedFilesize,
                archivedAt: metadata.archivedAt,
                issueNumber: metadata.issueNumber,
                description: metadata.english || metadata.chinese || metadata.remark || '',
                originalDescription: metadata.chinese || metadata.remark || '',
                translatedDescription: metadata.english || '',
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
    
    for (const deviceType of sortedDevices) {
      readme += `### ${deviceType}\n\n`;
      
      const types = Object.keys(deviceGroups[deviceType]).sort();
      for (const firmwareType of types) {
        if (types.length > 1) {
          readme += `#### ${firmwareType}\n\n`;
        }
        
        readme += "| Version | File Size | Added | Download | Issue | Description |\n";
        readme += "|---------|-----------|-------|----------|-------|-------------|\n";
        
        deviceGroups[deviceType][firmwareType].forEach(fw => {
          const issueLink = fw.issueNumber ? `[#${fw.issueNumber}](../../issues/${fw.issueNumber})` : '-';
          
          let description = '';
          const hasChineseChars = /[\u4e00-\u9fff]/.test(fw.description);
          
          if (fw.originalDescription && fw.translatedDescription && fw.originalDescription !== fw.translatedDescription) {
            // Different original and translated - show both
            const original = fw.originalDescription.length > 50 ? fw.originalDescription.substring(0, 50) + '...' : fw.originalDescription;
            const translated = fw.translatedDescription.length > 50 ? fw.translatedDescription.substring(0, 50) + '...' : fw.translatedDescription;
            description = `${original.replace(/\n/g, ' ')} <br/> *${translated.replace(/\n/g, ' ')}*`;
          } else if (hasChineseChars) {
            // Chinese text with inline translate toggle
            const text = fw.description.length > 60 ? fw.description.substring(0, 60) + '...' : fw.description;
            const fullText = fw.description.replace(/\n/g, ' ').replace(/'/g, "\\'");
            description = `<span>${text.replace(/\n/g, ' ')}</span> <a href="#" onclick="translateInline(this, '${fullText}'); return false;" title="Click to translate">🌐</a>`;
          } else {
            // English or other text without translation
            const text = fw.description.length > 80 ? fw.description.substring(0, 80) + '...' : fw.description;
            description = text.replace(/\n/g, ' ');
          }
          
          readme += `| v${fw.version} | ${formatFileSize(fw.filesize)} | ${formatDate(fw.archivedAt)} | [📁 ${fw.filename}](${fw.relativePath}) | ${issueLink} | ${description.replace(/\|/g, '\\|')} |\n`;
          totalCount++;
        });
        
        readme += "\n";
      }
    }
    
    readme += `---\n\n**Total firmware files:** ${totalCount}\n`;
    readme += `**Last updated:** ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n\n`;
  }

  readme += `## Usage

1. Browse the firmware table above to find your device type and desired version
2. Click the download link to get the binary file
3. Use your device's firmware update mechanism to install

## Firmware Query Tool

🔍 **[Marstek Firmware Query Tool](https://github.com/rweijnen/marstek-firmware-query)**

This companion tool allows you to:
- Query the latest available firmware directly from Marstek servers for your specific device(s)
- Check firmware versions and release notes before downloading
- Optionally submit newly discovered firmware to this archive automatically
- Batch query multiple devices at once

The query tool fetches real-time firmware information and can help keep this archive up-to-date by submitting new firmware versions as they become available.

## Contributing

This archive is automatically maintained. Firmware submissions are processed via GitHub Issues with the \`firmware-submission\` label.

You can contribute by:
- Using the [Firmware Query Tool](https://github.com/rweijnen/marstek-firmware-query) to discover and submit new firmware
- Manually creating issues with firmware submission data
- Reporting issues with existing firmware files

## Archive Structure

- **Standard devices** (HMG-50): \`firmwares/[device]/[type]/[version]/\`
- **HME devices** (HME-3, HME-4): \`firmwares/[device]/[version]/\`

Each firmware directory contains:
- Binary firmware file
- \`metadata.json\` with submission details and checksums

<script>
async function translateInline(element, text) {
  if (element.dataset.translated === 'true') {
    // Show original
    element.previousElementSibling.textContent = element.dataset.original;
    element.textContent = '🌐';
    element.title = 'Click to translate';
    element.dataset.translated = 'false';
  } else {
    // Store original and translate
    if (!element.dataset.original) {
      element.dataset.original = element.previousElementSibling.textContent;
    }
    
    element.textContent = '⏳';
    element.title = 'Translating...';
    
    try {
      const response = await fetch(\`https://api.mymemory.translated.net/get?q=\${encodeURIComponent(text)}&langpair=zh|en\`);
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        element.previousElementSibling.textContent = data.responseData.translatedText;
        element.textContent = '🔄';
        element.title = 'Click to show original';
        element.dataset.translated = 'true';
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      element.textContent = '❌';
      element.title = 'Translation failed';
      setTimeout(() => {
        element.textContent = '🌐';
        element.title = 'Click to translate';
      }, 2000);
    }
  }
}
</script>
`;

  return readme;
}

// Generate and write README
try {
  console.log('Generating README with inline translation...');
  const readmeContent = generateReadme();
  fs.writeFileSync('README.md', readmeContent);
  console.log('README.md updated successfully');
} catch (error) {
  console.error('Error generating README:', error);
  process.exit(1);
}
# Marstek Firmware Archive

Community firmware archive for Marstek solar/battery devices.

## Available Firmware

### HME-4

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v120 | 66 KB | Aug 25, 2025 | [📁 202507021110400569f6547.bin](firmwares/HME-4/120/202507021110400569f6547.bin) | - | <span>1、优化了UDP接收和重启优化 2、加入蓝牙升级移远模组命令 3、连接从机改到15台</span> <a href="#" onclick="translateInline(this, '1、优化了UDP接收和重启优化 2、加入蓝牙升级移远模组命令 3、连接从机改到15台'); return false;" title="Click to translate">🌐</a> |

### HMG-50

#### BMS

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v215 | 72 KB | Aug 25, 2025 | [📁 20250806112046448ef9739.bin](firmwares/HMG-50/BMS/215/20250806112046448ef9739.bin) | - | <span>满电回差由97调整到99，优化升级稳定性。</span> <a href="#" onclick="translateInline(this, '满电回差由97调整到99，优化升级稳定性。'); return false;" title="Click to translate">🌐</a> |

#### Control

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v153 | 222 KB | Aug 25, 2025 | [📁 202505301136007a5b57023.bin](firmwares/HMG-50/Control/153/202505301136007a5b57023.bin) | - | <span>1、支持对无密码WIFI进行配网功能；2、优化一些已知问题</span> <a href="#" onclick="translateInline(this, '1、支持对无密码WIFI进行配网功能；2、优化一些已知问题'); return false;" title="Click to translate">🌐</a> |

---

**Total firmware files:** 3
**Last updated:** 8/25/2025, 10:31:17 AM UTC

## Usage

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

This archive is automatically maintained. Firmware submissions are processed via GitHub Issues with the `firmware-submission` label.

You can contribute by:
- Using the [Firmware Query Tool](https://github.com/rweijnen/marstek-firmware-query) to discover and submit new firmware
- Manually creating issues with firmware submission data
- Reporting issues with existing firmware files

## Archive Structure

- **Standard devices** (HMG-50): `firmwares/[device]/[type]/[version]/`
- **HME devices** (HME-3, HME-4): `firmwares/[device]/[version]/`

Each firmware directory contains:
- Binary firmware file
- `metadata.json` with submission details and checksums

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
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|en`);
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

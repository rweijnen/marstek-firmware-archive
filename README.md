# Marstek Firmware Archive

Community firmware archive for Marstek solar/battery devices.

## Available Firmware

### HME-4

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v120 | 66 KB | Aug 25, 2025 | [📁 202507021110400569f6547.bin](firmwares/HME-4/120/202507021110400569f6547.bin) | - | 1、优化了UDP接收和重启优化 2、加入蓝牙升级移远模组命令 3、连接从机改到15台 [🌐](https://translate.google.com/?sl=zh&tl=en&text=1%E3%80%81%E4%BC%98%E5%8C%96%E4%BA%86UDP%E6%8E%A5%E6%94%B6%E5%92%8C%E9%87%8D%E5%90%AF%E4%BC%98%E5%8C%96%0A2%E3%80%81%E5%8A%A0%E5%85%A5%E8%93%9D%E7%89%99%E5%8D%87%E7%BA%A7%E7%A7%BB%E8%BF%9C%E6%A8%A1%E7%BB%84%E5%91%BD%E4%BB%A4%0A3%E3%80%81%E8%BF%9E%E6%8E%A5%E4%BB%8E%E6%9C%BA%E6%94%B9%E5%88%B015%E5%8F%B0 "Translate to English") |

### HMG-50

#### BMS

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v215 | 72 KB | Aug 25, 2025 | [📁 20250806112046448ef9739.bin](firmwares/HMG-50/BMS/215/20250806112046448ef9739.bin) | - | 满电回差由97调整到99，优化升级稳定性。 [🌐](https://translate.google.com/?sl=zh&tl=en&text=%E6%BB%A1%E7%94%B5%E5%9B%9E%E5%B7%AE%E7%94%B197%E8%B0%83%E6%95%B4%E5%88%B099%EF%BC%8C%E4%BC%98%E5%8C%96%E5%8D%87%E7%BA%A7%E7%A8%B3%E5%AE%9A%E6%80%A7%E3%80%82 "Translate to English") |

#### Control

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v153 | 222 KB | Aug 25, 2025 | [📁 202505301136007a5b57023.bin](firmwares/HMG-50/Control/153/202505301136007a5b57023.bin) | - | 1、支持对无密码WIFI进行配网功能；2、优化一些已知问题 [🌐](https://translate.google.com/?sl=zh&tl=en&text=1%E3%80%81%E6%94%AF%E6%8C%81%E5%AF%B9%E6%97%A0%E5%AF%86%E7%A0%81WIFI%E8%BF%9B%E8%A1%8C%E9%85%8D%E7%BD%91%E5%8A%9F%E8%83%BD%EF%BC%9B2%E3%80%81%E4%BC%98%E5%8C%96%E4%B8%80%E4%BA%9B%E5%B7%B2%E7%9F%A5%E9%97%AE%E9%A2%98 "Translate to English") |

---

**Total firmware files:** 3
**Last updated:** 8/25/2025, 10:32:37 AM UTC

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

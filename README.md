# Marstek Firmware Archive

Community firmware archive for Marstek solar/battery devices.

## Available Firmware

### CT002

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v120 | 66 KB | Aug 25, 2025 | [📁 202507021110400569f6547.bin](firmwares/CT002/120/202507021110400569f6547.bin) | - | 1、优化了UDP接收和重启优化 2、加入蓝牙升级移远模组命令 3、连接从机改到15台 |

### HMG-50

#### BMS

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v215 | 72 KB | Aug 25, 2025 | [📁 20250806112046448ef9739.bin](firmwares/HMG-50/BMS/215/20250806112046448ef9739.bin) | - | 满电回差由97调整到99，优化升级稳定性。 |

#### Control

| Version | File Size | Added | Download | Issue | Description |
|---------|-----------|-------|----------|-------|-------------|
| v153 | 222 KB | Aug 25, 2025 | [📁 202505301136007a5b57023.bin](firmwares/HMG-50/Control/153/202505301136007a5b57023.bin) | - | 1、支持对无密码WIFI进行配网功能；2、优化一些已知问题 |

---

**Total firmware files:** 3
**Last updated:** 8/25/2025, 10:18:27 AM UTC

## Usage

1. Browse the firmware table above to find your device type and desired version
2. Click the download link to get the binary file
3. Use your device's firmware update mechanism to install

## Contributing

This archive is automatically maintained. Firmware submissions are processed via GitHub Issues with the `firmware-submission` label.

## Archive Structure

- **Standard devices** (HMG-50): `firmwares/[device]/[type]/[version]/`
- **HME devices** (HME-3, HME-4): `firmwares/[device]/[version]/`

Each firmware directory contains:
- Binary firmware file
- `metadata.json` with submission details and checksums

## Description

This is a mobile application for patients. This requires at least flutter version 2.0.0

## Installation

**1. Edit baseUrl in `healthcare\app\lib\utils\http_client.dart` file**

```
static final String baseUrl = '{your-backend-endpoint}';
```

**2. Upgrade flutter**

```
flutter upgrade
```

```
flutter clean cache
```

**3. Install dependencies**

```
flutter pub get
```

## Running the app

```
flutter run --no-sound-null-safety
```

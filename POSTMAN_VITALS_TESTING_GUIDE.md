# Postman Testing Data for Edit Vitals Functionality

This document provides Postman testing data for the Edit Vitals API endpoint.

## Base Configuration

- **Base URL**: `http://localhost:3000` (or your server URL)
- **Endpoint**: `PUT /vitals/:id` or `PATCH /vitals/:id`
- **Content-Type**: `application/json`
- **Authorization**: Bearer token (if required)

## Test Cases

### 1. Complete Vitals Update (All Fields)

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "date": "2024-01-15T10:30:00.000Z",
  "time": "10:30 AM",
  "weight": 75.5,
  "temperature": 98.6,
  "temperatureType": "Fahrenheit",
  "pulse": 72,
  "systolicBloodPressure": 120,
  "diastolicBloodPressure": 80,
  "bloodPressurePosition": "Sitting",
  "respiratoryRate": 18,
  "oxygenSaturation": 98,
  "oxygenSaturationUnit": "%",
  "bloodSugar": 95,
  "bloodSugarCondition": "Normal",
  "note": "Patient appears healthy. All vitals within normal range.",
  "residentId": 1
}
```

---

### 2. Partial Update (PATCH Method)

**Method**: `PATCH`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "temperature": 99.2,
  "pulse": 85,
  "note": "Patient has slight fever. Monitoring closely."
}
```

---

### 3. Blood Pressure Update Only

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "systolicBloodPressure": 130,
  "diastolicBloodPressure": 85,
  "bloodPressurePosition": "Standing",
  "note": "Blood pressure slightly elevated. Patient was standing during measurement."
}
```

**Possible Values for `bloodPressurePosition`**:
- "Sitting"
- "Standing"
- "Lying"
- "Supine"

---

### 4. Temperature Update (Celsius)

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "temperature": 37.5,
  "temperatureType": "Celsius",
  "note": "Temperature converted to Celsius"
}
```

**Possible Values for `temperatureType`**:
- "Fahrenheit"
- "Celsius"

---

### 5. Oxygen Saturation Update

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "oxygenSaturation": 96,
  "oxygenSaturationUnit": "%",
  "respiratoryRate": 20,
  "note": "Oxygen saturation slightly low. Patient on room air."
}
```

**Possible Values for `oxygenSaturationUnit`**:
- "%"
- "mmHg"

---

### 6. Blood Sugar Update

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "bloodSugar": 140,
  "bloodSugarCondition": "Pre-diabetic",
  "note": "Blood sugar elevated. Patient advised to monitor diet."
}
```

**Possible Values for `bloodSugarCondition`**:
- "Normal"
- "Pre-diabetic"
- "Diabetic"
- "Hypoglycemic"
- "Hyperglycemic"

---

### 7. Weight Update with Date/Time

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "weight": 76.2,
  "date": "2024-01-16T08:00:00.000Z",
  "time": "8:00 AM",
  "note": "Weight check - slight increase noted."
}
```

**Date Format**: ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)  
**Time Format**: String format (e.g., "8:00 AM", "14:30", "2:30 PM")

---

### 8. Minimal Update

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "pulse": 70,
  "note": "Routine check"
}
```

---

### 9. Update with Null Values (Clearing Fields)

**Method**: `PUT`  
**URL**: `/vitals/1`  
**Request Body**:
```json
{
  "date": "2024-01-15T14:00:00.000Z",
  "time": "2:00 PM",
  "weight": null,
  "temperature": null,
  "temperatureType": null,
  "pulse": null,
  "systolicBloodPressure": null,
  "diastolicBloodPressure": null,
  "bloodPressurePosition": null,
  "respiratoryRate": null,
  "oxygenSaturation": null,
  "oxygenSaturationUnit": null,
  "bloodSugar": null,
  "bloodSugarCondition": null,
  "note": "Cleared all vitals readings",
  "residentId": 1
}
```

---

## Field Reference

Based on the Prisma schema, here are all available fields:

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `date` | DateTime | No | Date of vitals reading |
| `time` | String (50) | No | Time of vitals reading |
| `weight` | Float | No | Weight in kg/lbs |
| `temperature` | Float | No | Body temperature |
| `temperatureType` | String (50) | No | "Fahrenheit" or "Celsius" |
| `pulse` | Float | No | Heart rate (beats per minute) |
| `systolicBloodPressure` | Float | No | Systolic BP (top number) |
| `diastolicBloodPressure` | Float | No | Diastolic BP (bottom number) |
| `bloodPressurePosition` | String (50) | No | Position during measurement |
| `respiratoryRate` | Float | No | Breaths per minute |
| `oxygenSaturation` | Float | No | SpO2 percentage |
| `oxygenSaturationUnit` | String (50) | No | Unit for oxygen saturation |
| `bloodSugar` | Float | No | Blood glucose level |
| `bloodSugarCondition` | String (100) | No | Condition status |
| `note` | String (1000) | No | Additional notes |
| `residentId` | Int | No | Resident ID (usually from URL) |

---

## Expected Response Examples

### Success Response (200 OK)
```json
{
  "id": 1,
  "date": "2024-01-15T10:30:00.000Z",
  "time": "10:30 AM",
  "weight": 75.5,
  "temperature": 98.6,
  "temperatureType": "Fahrenheit",
  "pulse": 72,
  "systolicBloodPressure": 120,
  "diastolicBloodPressure": 80,
  "bloodPressurePosition": "Sitting",
  "respiratoryRate": 18,
  "oxygenSaturation": 98,
  "oxygenSaturationUnit": "%",
  "bloodSugar": 95,
  "bloodSugarCondition": "Normal",
  "note": "Patient appears healthy. All vitals within normal range.",
  "residentId": 1,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "createdBy": 1,
  "updatedBy": 2
}
```

### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Vitals record not found",
  "error": "Not Found"
}
```

### Error Response (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    "temperature must be a number",
    "pulse must be a positive number"
  ]
}
```

---

## Postman Environment Variables

Create these variables in your Postman environment:

- `baseUrl`: `http://localhost:3000`
- `authToken`: Your authentication token
- `vitalsId`: ID of the vitals record to update (e.g., `1`)
- `residentId`: ID of the resident (e.g., `1`)

---

## Quick Import

You can import the `postman_vitals_edit_testing_data.json` file directly into Postman:
1. Open Postman
2. Click "Import"
3. Select the JSON file
4. All test cases will be imported as a collection

---

## Notes

- Replace `:id` in the URL with the actual vitals record ID
- All fields except `id` are optional (nullable) in the schema
- Date should be in ISO 8601 format
- Time can be in various formats (12-hour or 24-hour)
- Ensure `residentId` matches an existing resident in your database
- The `updatedBy` field is typically set automatically from the authenticated user

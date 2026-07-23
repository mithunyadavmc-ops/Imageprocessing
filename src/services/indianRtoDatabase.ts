/**
 * Indian RTO Database and Number Plate Validator
 */

export interface RtoStateInfo {
  code: string;
  name: string;
  districts: Record<string, string>;
}

export const INDIAN_RTO_STATES: Record<string, RtoStateInfo> = {
  AN: { code: 'AN', name: 'Andaman and Nicobar Islands', districts: { '01': 'Port Blair' } },
  AP: { code: 'AP', name: 'Andhra Pradesh', districts: { '07': 'Guntur', '16': 'Vijayawada', '26': 'Visakhapatnam', '39': 'Tirupati' } },
  AR: { code: 'AR', name: 'Arunachal Pradesh', districts: { '01': 'Itanagar' } },
  AS: { code: 'AS', name: 'Assam', districts: { '01': 'Guwahati', '02': 'Dhubri', '06': 'Silchar' } },
  BR: { code: 'BR', name: 'Bihar', districts: { '01': 'Patna', '02': 'Gaya', '03': 'Muzaffarpur' } },
  CG: { code: 'CG', name: 'Chhattisgarh', districts: { '04': 'Raipur', '07': 'Durg', '10': 'Bilaspur' } },
  CH: { code: 'CH', name: 'Chandigarh', districts: { '01': 'Chandigarh' } },
  DD: { code: 'DD', name: 'Dadra and Nagar Haveli and Daman and Diu', districts: { '01': 'Daman', '02': 'Diu', '03': 'Silvassa' } },
  DL: { code: 'DL', name: 'Delhi', districts: { '01': 'North Delhi (Mall Road)', '02': 'New Delhi (IP Depot)', '03': 'South Delhi (Sheikh Sarai)', '04': 'West Delhi (Janakpuri)', '05': 'North East Delhi (Loni Road)', '06': 'Central Delhi (Sarai Kale Khan)', '07': 'East Delhi (Mayur Vihar)', '08': 'North West Delhi (Wazirpur)', '09': 'South West Delhi (Palam)', '10': 'West-II Delhi (Raja Garden)', '11': 'Rohini', '12': 'Vasant Vihar', '13': 'Surajmal Vihar' } },
  GA: { code: 'GA', name: 'Goa', districts: { '01': 'Panaji', '02': 'Margao', '03': 'Mapusa' } },
  GJ: { code: 'GJ', name: 'Gujarat', districts: { '01': 'Ahmedabad', '03': 'Rajkot', '05': 'Surat', '06': 'Vadodara', '18': 'Gandhinagar', '27': 'Ahmedabad East' } },
  HP: { code: 'HP', name: 'Himachal Pradesh', districts: { '01': 'Shimla', '02': 'Dharamshala', '03': 'Mandi' } },
  HR: { code: 'HR', name: 'Haryana', districts: { '06': 'Panipat', '10': 'Sonepat', '20': 'Hisar', '26': 'Gurugram North', '51': 'Faridabad', '55': 'Gurugram Commercial' } },
  JH: { code: 'JH', name: 'Jharkhand', districts: { '01': 'Ranchi', '02': 'Hazaribagh', '05': 'Jamshedpur' } },
  JK: { code: 'JK', name: 'Jammu and Kashmir', districts: { '01': 'Srinagar', '02': 'Jammu', '03': 'Anantnag' } },
  KA: { code: 'KA', name: 'Karnataka', districts: { '01': 'Bengaluru Central', '02': 'Bengaluru West', '03': 'Bengaluru East', '04': 'Bengaluru North', '05': 'Bengaluru South', '09': 'Mysuru', '12': 'Madikeri', '19': 'Mangaluru', '20': 'Udupi', '22': 'Belagavi', '25': 'Dharwad', '51': 'Electronic City (Bengaluru)', '53': 'K R Puram (Bengaluru)' } },
  KL: { code: 'KL', name: 'Kerala', districts: { '01': 'Thiruvananthapuram', '07': 'Ernakulam (Kochi)', '08': 'Thrissur', '11': 'Kozhikode', '15': 'Kollam' } },
  LA: { code: 'LA', name: 'Ladakh', districts: { '01': 'Leh', '02': 'Kargil' } },
  LD: { code: 'LD', name: 'Lakshadweep', districts: { '01': 'Kavaratti' } },
  MH: { code: 'MH', name: 'Maharashtra', districts: { '01': 'Mumbai Central', '02': 'Mumbai West (Andheri)', '03': 'Mumbai East (Wadala)', '04': 'Thane', '12': 'Pune', '14': 'Pimpri-Chinchwad', '15': 'Nashik', '31': 'Nagpur', '43': 'Vashi (Navi Mumbai)', '46': 'Panvel' } },
  ML: { code: 'ML', name: 'Meghalaya', districts: { '01': 'Shillong', '02': 'Jowai' } },
  MN: { code: 'MN', name: 'Manipur', districts: { '01': 'Imphal', '02': 'Churachandpur' } },
  MP: { code: 'MP', name: 'Madhya Pradesh', districts: { '04': 'Bhopal', '09': 'Indore', '20': 'Jabalpur', '07': 'Gwalior' } },
  MZ: { code: 'MZ', name: 'Mizoram', districts: { '01': 'Aizawl' } },
  NL: { code: 'NL', name: 'Nagaland', districts: { '01': 'Kohima', '02': 'Dimapur' } },
  OD: { code: 'OD', name: 'Odisha', districts: { '02': 'Bhubaneswar', '05': 'Cuttack', '14': 'Rourkela' } },
  PB: { code: 'PB', name: 'Punjab', districts: { '01': 'Amritsar', '08': 'Ludhiana', '11': 'Jalandhar', '65': 'Mohali' } },
  PY: { code: 'PY', name: 'Puducherry', districts: { '01': 'Puducherry', '02': 'Karaikal' } },
  RJ: { code: 'RJ', name: 'Rajasthan', districts: { '14': 'Jaipur South', '19': 'Jodhpur', '20': 'Kota', '27': 'Udaipur', '45': 'Jaipur North' } },
  SK: { code: 'SK', name: 'Sikkim', districts: { '01': 'Gangtok' } },
  TN: { code: 'TN', name: 'Tamil Nadu', districts: { '01': 'Chennai Central', '02': 'Chennai North-West', '03': 'Chennai North-East', '04': 'Chennai East', '05': 'Chennai North', '06': 'Chennai South-East', '07': 'Chennai South', '09': 'Chennai West', '37': 'Coimbatore South', '38': 'Coimbatore North', '59': 'Madurai North' } },
  TR: { code: 'TR', name: 'Tripura', districts: { '01': 'Agartala' } },
  TS: { code: 'TS', name: 'Telangana', districts: { '07': 'Hyderabad Central', '08': 'Hyderabad South', '09': 'Hyderabad North', '10': 'Secunderabad', '11': 'Malakpet', '12': 'Kishanbagh', '13': 'Tolichowki', '14': 'Uppal' } },
  UK: { code: 'UK', name: 'Uttarakhand', districts: { '07': 'Dehradun', '08': 'Haridwar', '04': 'Nainital' } },
  UA: { code: 'UA', name: 'Uttarakhand (Former)', districts: { '01': 'Dehradun', '07': 'Dehradun' } },
  UP: { code: 'UP', name: 'Uttar Pradesh', districts: { '14': 'Gautam Buddha Nagar (Noida)', '16': 'Ghaziabad', '32': 'Lucknow', '70': 'Prayagraj (Allahabad)', '78': 'Kanpur', '80': 'Agra' } },
  WB: { code: 'WB', name: 'West Bengal', districts: { '01': 'Kolkata Beltala', '02': 'Kolkata Kasba', '06': 'Howrah', '20': 'Durgapur', '73': 'Siliguri' } },
  BH: { code: 'BH', name: 'Bharat Series (Pan-India)', districts: { '01': 'Defense / Govt / Corporate' } },
};

export interface ValidatePlateResult {
  isValid: boolean;
  reason?: string;
  cleanedText: string;
  stateCode?: string;
  stateName?: string;
  districtCode?: string;
  districtName?: string;
  series?: string;
  regNumber?: string;
  isBharatSeries?: boolean;
}

/**
 * Optical character disambiguation helper for Indian plates
 * Fixes common OCR confusions based on expected position (State letters, RTO digits, Series letters, Reg digits)
 * Supports all 36 Indian States & Union Territories + Bharat Series without bias.
 */
export function disambiguateIndianPlate(raw: string): string {
  let s = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (s.length < 4) return s;

  // 1. Strip country code / HSRP prefix markings (IND, INDIA, HSRP)
  if (s.startsWith('IND') && s.length >= 6) {
    const afterInd = s.slice(3);
    const prefix2 = afterInd.slice(0, 2);
    if (INDIAN_RTO_STATES[prefix2] || /^[A-Z]{2}[0-9]/.test(afterInd) || /^[0-9]{2}BH/.test(afterInd)) {
      s = afterInd;
    }
  } else if (s.startsWith('INDIA') && s.length >= 8) {
    const afterIndia = s.slice(5);
    const prefix2 = afterIndia.slice(0, 2);
    if (INDIAN_RTO_STATES[prefix2] || /^[A-Z]{2}[0-9]/.test(afterIndia)) {
      s = afterIndia;
    }
  } else if (s.startsWith('HSRP') && s.length >= 7) {
    const afterHsrp = s.slice(4);
    if (/^[A-Z]{2}[0-9]/.test(afterHsrp)) {
      s = afterHsrp;
    }
  }

  if (s.endsWith('IND') && s.length >= 8) {
    s = s.slice(0, -3);
  }

  // 2. State Code Disambiguation (First 2 chars)
  let prefix = s.slice(0, 2);
  if (!INDIAN_RTO_STATES[prefix]) {
    const toChar = (c: string) => {
      switch (c) {
        case '0': return 'O';
        case '1': return 'I';
        case '8': return 'B';
        case '5': return 'S';
        case '2': return 'Z';
        case '6': return 'G';
        default: return c;
      }
    };

    const c1 = toChar(prefix[0]);
    const c2 = toChar(prefix[1]);
    const convertedPrefix = c1 + c2;

    if (INDIAN_RTO_STATES[convertedPrefix]) {
      s = convertedPrefix + s.slice(2);
      prefix = convertedPrefix;
    } else {
      const STATE_DIGIT_FIXES: Record<string, string> = {
        'M1': 'MH', 'MI': 'MH', 'M4': 'MH', '4H': 'MH',
        'K1': 'KA', 'K4': 'KA',
        'D1': 'DL', 'DI': 'DL',
        'U1': 'UP', 'UI': 'UP',
        'T1': 'TN', 'TI': 'TN', 'T5': 'TS', 'T2': 'TS',
        'R1': 'RJ', 'RI': 'RJ',
        'W1': 'WB', 'WI': 'WB',
        'G1': 'GJ', 'GI': 'GJ',
        'H1': 'HR', 'HI': 'HR',
        'A1': 'AP', 'AI': 'AP',
        'P1': 'PB', 'PI': 'PB',
        'B1': 'BR', 'BI': 'BR',
        'C1': 'CG', 'CI': 'CG',
        'J1': 'JH', 'JI': 'JH',
      };
      if (STATE_DIGIT_FIXES[prefix]) {
        s = STATE_DIGIT_FIXES[prefix] + s.slice(2);
        prefix = STATE_DIGIT_FIXES[prefix];
      }
    }
  }

  // 3. Normalize single-digit district RTO code (e.g., DL1C1234 -> DL01C1234)
  const singleDigitDistrictMatch = s.match(/^([A-Z]{2})([0-9])([A-Z]{1,3})([0-9]{1,4})$/);
  if (singleDigitDistrictMatch) {
    s = `${singleDigitDistrictMatch[1]}0${singleDigitDistrictMatch[2]}${singleDigitDistrictMatch[3]}${singleDigitDistrictMatch[4]}`;
  }

  // 4. Character position disambiguation for standard format (SS DD AA NNNN)
  const toChar = (c: string) => {
    switch (c) {
      case '0': return 'O';
      case '1': return 'I';
      case '8': return 'B';
      case '5': return 'S';
      case '2': return 'Z';
      case '6': return 'G';
      default: return c;
    }
  };

  const toDigit = (c: string) => {
    switch (c) {
      case 'O': case 'D': case 'Q': return '0';
      case 'I': case 'L': case 'T': return '1';
      case 'Z': return '2';
      case 'S': return '5';
      case 'G': case 'b': return '6';
      case 'B': return '8';
      default: return c;
    }
  };

  const stdMatch = s.match(/^([A-Z]{2})([0-9A-Z]{2})([A-Z0-9]{1,3})([0-9A-Z]{4})$/);
  if (stdMatch) {
    const p1 = stdMatch[1];
    const p2 = stdMatch[2].split('').map(toDigit).join('');
    const p3 = stdMatch[3].split('').map(toChar).join('');
    const p4 = stdMatch[4].split('').map(toDigit).join('');
    return p1 + p2 + p3 + p4;
  }

  return s;
}

export function validateIndianNumberPlate(rawText: string): ValidatePlateResult {
  if (
    !rawText ||
    typeof rawText !== 'string' ||
    rawText.includes('could not') ||
    rawText.includes('not detected') ||
    rawText.includes('No vehicle') ||
    rawText.trim() === ''
  ) {
    return {
      isValid: false,
      reason: 'OCR could not reliably detect the registration number.',
      cleanedText: 'Not Detected',
      stateCode: 'Unknown',
      stateName: 'Unknown',
      districtCode: 'Unknown',
      districtName: 'Unknown',
    };
  }

  // Sanitize text (remove spaces, hyphens, dots, special characters, uppercase)
  let cleaned = rawText.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!cleaned || cleaned.length < 3) {
    return {
      isValid: false,
      reason: 'OCR could not reliably detect the registration number.',
      cleanedText: rawText && rawText !== 'Not Detected' ? rawText.toUpperCase().trim() : 'Not Detected',
      stateCode: 'Unknown',
      stateName: 'Unknown',
      districtCode: 'Unknown',
      districtName: 'Unknown',
    };
  }

  // Apply optical character disambiguation for Indian plates
  cleaned = disambiguateIndianPlate(cleaned);

  // Attempt to extract State Code (first 2 alpha characters)
  const stateMatch = cleaned.match(/^([A-Z]{2})/);
  const candidateStateCode = stateMatch ? stateMatch[1] : '';
  const stateInfo = candidateStateCode ? INDIAN_RTO_STATES[candidateStateCode] : undefined;

  const stateCode = stateInfo ? stateInfo.code : candidateStateCode || 'Unknown';
  const stateName = stateInfo ? stateInfo.name : candidateStateCode ? `${candidateStateCode} Region / State` : 'Unknown';

  // Extract RTO / District Code (digits following the state code)
  const rtoMatch = cleaned.match(/^[A-Z]{2}([0-9]{1,2})/);
  const districtCode = rtoMatch ? rtoMatch[1].padStart(2, '0') : 'Unknown';
  const districtName =
    stateInfo && districtCode !== 'Unknown'
      ? stateInfo.districts[districtCode] || `RTO Code ${districtCode} (${stateName})`
      : districtCode !== 'Unknown'
      ? `RTO Code ${districtCode}`
      : 'Unknown';

  // Check 1: Bharat Series (e.g. 22BH1234AA or 21BH5678B)
  const bhartPattern = /^([0-9]{2})BH([0-9]{4})([A-Z]{1,2})$/;
  const bhMatch = cleaned.match(bhartPattern);
  if (bhMatch) {
    return {
      isValid: true,
      reason: 'Valid Indian Bharat Series (BH) Registration',
      cleanedText: cleaned,
      stateCode: 'BH',
      stateName: 'Bharat Series (Pan-India)',
      districtCode: bhMatch[1],
      districtName: `Registered Year 20${bhMatch[1]}`,
      regNumber: bhMatch[2],
      series: bhMatch[3],
      isBharatSeries: true,
    };
  }

  // Check 2: Standard Format: SS DD AA NNNN (StateCode, DistrictCode, Series, Number)
  // Example: KA01AB1234 or MH12DE4567 or DL05CC1234 or UP32AB1234
  const standardPattern = /^([A-Z]{2})([0-9]{1,2})([A-Z]{1,3})([0-9]{1,4})$/;
  const stdMatch = cleaned.match(standardPattern);

  if (stdMatch) {
    return {
      isValid: true,
      reason: stateInfo ? 'Valid Indian Registration Number' : 'Valid Format Registration Number',
      cleanedText: cleaned,
      stateCode,
      stateName,
      districtCode,
      districtName,
      series: stdMatch[3],
      regNumber: stdMatch[4],
    };
  }

  // Check 3: Flexible / Legacy format (e.g. KA011234 or DL1A1234 or KA05MC1234)
  const legacyPattern = /^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/;
  const legMatch = cleaned.match(legacyPattern);

  if (legMatch) {
    return {
      isValid: true,
      reason: stateInfo ? 'Valid Indian Registration Number' : 'Valid Format Registration Number',
      cleanedText: cleaned,
      stateCode,
      stateName,
      districtCode,
      districtName,
      series: legMatch[3] || 'GENERAL',
      regNumber: legMatch[4],
    };
  }

  // Check 4: General Alphanumeric Vehicle Registration (4 to 12 chars)
  if (cleaned.length >= 4 && /[0-9]/.test(cleaned) && /[A-Z]/.test(cleaned)) {
    return {
      isValid: true,
      reason: 'Detected Registration Code',
      cleanedText: cleaned,
      stateCode: stateCode !== 'Unknown' ? stateCode : 'REG',
      stateName: stateName !== 'Unknown' ? stateName : 'Vehicle Registration Authority',
      districtCode,
      districtName,
      series: 'GENERAL',
      regNumber: cleaned.slice(-4),
    };
  }

  return {
    isValid: false,
    reason: 'Unrecognized Registration Format',
    cleanedText: cleaned || rawText,
    stateCode,
    stateName,
    districtCode,
    districtName,
  };
}

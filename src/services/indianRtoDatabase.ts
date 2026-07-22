/**
 * Indian RTO Database and Number Plate Validator
 */

export interface RtoStateInfo {
  code: string;
  name: string;
  districts: Record<string, string>;
}

export const INDIAN_RTO_STATES: Record<string, RtoStateInfo> = {
  KA: {
    code: 'KA',
    name: 'Karnataka',
    districts: {
      '01': 'Bengaluru Central',
      '02': 'Bengaluru West',
      '03': 'Bengaluru East',
      '04': 'Bengaluru North',
      '05': 'Bengaluru South',
      '09': 'Mysuru',
      '12': 'Madikeri',
      '19': 'Mangaluru',
      '20': 'Udupi',
      '22': 'Belagavi',
      '25': 'Dharwad',
      '51': 'Electronic City (Bengaluru)',
      '53': 'K R Puram (Bengaluru)',
    },
  },
  MH: {
    code: 'MH',
    name: 'Maharashtra',
    districts: {
      '01': 'Mumbai Central',
      '02': 'Mumbai West (Andheri)',
      '03': 'Mumbai East (Wadala)',
      '04': 'Thane',
      '12': 'Pune',
      '14': 'Pimpri-Chinchwad',
      '15': 'Nashik',
      '31': 'Nagpur',
      '43': 'Vashi (Navi Mumbai)',
      '46': 'Panvel',
    },
  },
  DL: {
    code: 'DL',
    name: 'Delhi',
    districts: {
      '01': 'Mall Road (North)',
      '02': 'IP Depot (New Delhi)',
      '03': 'Sheikh Sarai (South)',
      '04': 'Janakpuri (West)',
      '05': 'Loni Road (North East)',
      '06': 'Sarai Kale Khan (Central)',
      '07': 'Mayur Vihar (East)',
      '08': 'Wazirpur (North West)',
      '09': 'Palam (South West)',
      '10': 'Raja Garden (West-II)',
      '11': 'Rohini',
      '12': 'Vasant Vihar',
      '13': 'Surajmal Vihar',
    },
  },
  TN: {
    code: 'TN',
    name: 'Tamil Nadu',
    districts: {
      '01': 'Chennai Central',
      '02': 'Chennai North-West',
      '03': 'Chennai North-East',
      '04': 'Chennai East',
      '05': 'Chennai North',
      '06': 'Chennai South-East',
      '07': 'Chennai South',
      '09': 'Chennai West',
      '37': 'Coimbatore South',
      '38': 'Coimbatore North',
      '59': 'Madurai North',
    },
  },
  TS: {
    code: 'TS',
    name: 'Telangana',
    districts: {
      '07': 'Hyderabad Central',
      '08': 'Hyderabad South',
      '09': 'Hyderabad North',
      '10': 'Secunderabad',
      '11': 'Malakpet',
      '12': 'Kishanbagh',
      '13': 'Tolichowki',
      '14': 'Uppal',
    },
  },
  AP: {
    code: 'AP',
    name: 'Andhra Pradesh',
    districts: {
      '16': 'Vijayawada',
      '26': 'Visakhapatnam',
      '39': 'Tirupati',
      '07': 'Guntur',
    },
  },
  UP: {
    code: 'UP',
    name: 'Uttar Pradesh',
    districts: {
      '14': 'Gautam Buddha Nagar (Noida)',
      '16': 'Ghaziabad',
      '32': 'Lucknow',
      '70': 'Prayagraj (Allahabad)',
      '78': 'Kanpur',
      '80': 'Agra',
    },
  },
  HR: {
    code: 'HR',
    name: 'Haryana',
    districts: {
      '26': 'Gurugram North',
      '51': 'Faridabad',
      '06': 'Panipat',
      '10': 'Sonepat',
      '20': 'Hisar',
      '55': 'Gurugram Commercial',
    },
  },
  GJ: {
    code: 'GJ',
    name: 'Gujarat',
    districts: {
      '01': 'Ahmedabad',
      '03': 'Rajkot',
      '05': 'Surat',
      '06': 'Vadodara',
      '18': 'Gandhinagar',
      '27': 'Ahmedabad East',
    },
  },
  WB: {
    code: 'WB',
    name: 'West Bengal',
    districts: {
      '01': 'Kolkata Beltala',
      '02': 'Kolkata Kasba',
      '06': 'Howrah',
      '20': 'Durgapur',
      '73': 'Siliguri',
    },
  },
  KL: {
    code: 'KL',
    name: 'Kerala',
    districts: {
      '01': 'Thiruvananthapuram',
      '07': 'Erankulam (Kochi)',
      '08': 'Thrissur',
      '11': 'Kozhikode',
      '15': 'Kollam',
    },
  },
  RJ: {
    code: 'RJ',
    name: 'Rajasthan',
    districts: {
      '14': 'Jaipur South',
      '19': 'Jodhpur',
      '20': 'Kota',
      '27': 'Udaipur',
      '45': 'Jaipur North',
    },
  },
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

export function validateIndianNumberPlate(rawText: string): ValidatePlateResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      isValid: false,
      reason: 'No registration number detected or empty text.',
      cleanedText: '',
    };
  }

  // Sanitize text (remove spaces, hyphens, dots, special characters, uppercase)
  const cleaned = rawText.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (cleaned.length < 7 || cleaned.length > 12) {
    return {
      isValid: false,
      reason: `Invalid character count (${cleaned.length}). Standard Indian plates require 8 to 10 characters.`,
      cleanedText: cleaned,
    };
  }

  // Check 1: Bharat Series (e.g. 22BH1234AA)
  const bhartPattern = /^([0-9]{2})BH([0-9]{4})([A-Z]{1,2})$/;
  const bhMatch = cleaned.match(bhartPattern);
  if (bhMatch) {
    return {
      isValid: true,
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
  // Example: KA01AB1234 or MH12DE4567 or DL09AA9999 or KA51M1234
  const standardPattern = /^([A-Z]{2})([0-9]{2})([A-Z]{1,3})([0-9]{4})$/;
  const stdMatch = cleaned.match(standardPattern);

  if (stdMatch) {
    const stateCode = stdMatch[1];
    const districtCode = stdMatch[2];
    const series = stdMatch[3];
    const regNum = stdMatch[4];

    const stateInfo = INDIAN_RTO_STATES[stateCode];

    if (!stateInfo) {
      return {
        isValid: false,
        reason: `Unrecognized State/UT code '${stateCode}'. Valid codes include KA, MH, DL, TN, TS, UP, HR, GJ, etc.`,
        cleanedText: cleaned,
        stateCode,
        districtCode,
        series,
        regNumber: regNum,
      };
    }

    const districtName = stateInfo.districts[districtCode] || `RTO Office Code ${districtCode} (${stateInfo.name})`;

    return {
      isValid: true,
      cleanedText: cleaned,
      stateCode,
      stateName: stateInfo.name,
      districtCode,
      districtName,
      series,
      regNumber: regNum,
    };
  }

  // Check 3: Commercial / Old Format without series letters or vintage e.g. KA011234 or DL1A1234
  const legacyPattern = /^([A-Z]{2})([0-9]{1,2})([A-Z]{0,2})([0-9]{4})$/;
  const legMatch = cleaned.match(legacyPattern);

  if (legMatch) {
    const stateCode = legMatch[1];
    const districtCode = legMatch[2].padStart(2, '0');
    const series = legMatch[3] || 'GENERAL';
    const regNum = legMatch[4];

    const stateInfo = INDIAN_RTO_STATES[stateCode];
    if (!stateInfo) {
      return {
        isValid: false,
        reason: `Invalid State prefix '${stateCode}'.`,
        cleanedText: cleaned,
      };
    }

    return {
      isValid: true,
      cleanedText: cleaned,
      stateCode,
      stateName: stateInfo.name,
      districtCode,
      districtName: stateInfo.districts[districtCode] || `RTO Office ${districtCode}`,
      series,
      regNumber: regNum,
    };
  }

  return {
    isValid: false,
    reason: 'Format mismatch. Failed standard Indian registration structure (Expected: State[2] + District[2] + Series[1-3] + Digits[4], e.g. KA01AB1234).',
    cleanedText: cleaned,
  };
}

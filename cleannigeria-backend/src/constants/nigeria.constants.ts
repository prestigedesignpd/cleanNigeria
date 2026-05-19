export const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const

export type NigeriaState = (typeof NIGERIA_STATES)[number]

export const NIGERIA_PHONE_PREFIXES = [
  '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709',
  '0802', '0803', '0804', '0805', '0806', '0807', '0808', '0809',
  '0810', '0811', '0812', '0813', '0814', '0815', '0816', '0817', '0818', '0819',
  '0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908', '0909',
  '0912', '0913', '0915', '0916',
]

export const PHONE_REGEX = /^(\+234|0)?[789]\d{9}$/

export const NIGERIAN_CURRENCY = 'NGN'
export const KOBO_MULTIPLIER = 100 // Paystack uses kobo

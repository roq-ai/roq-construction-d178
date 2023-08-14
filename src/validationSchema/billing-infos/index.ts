import * as yup from 'yup';

export const billingInfoValidationSchema = yup.object().shape({
  biling_summary: yup.string().nullable(),
  invoice_amount: yup.number().integer().nullable(),
  user_id: yup.string().nullable(),
});

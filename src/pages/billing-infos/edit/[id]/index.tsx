import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getBillingInfoById, updateBillingInfoById } from 'apiSdk/billing-infos';
import { billingInfoValidationSchema } from 'validationSchema/billing-infos';
import { BillingInfoInterface } from 'interfaces/billing-info';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function BillingInfoEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<BillingInfoInterface>(
    () => (id ? `/billing-infos/${id}` : null),
    () => getBillingInfoById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BillingInfoInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBillingInfoById(id, values);
      mutate(updated);
      resetForm();
      router.push('/billing-infos');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BillingInfoInterface>({
    initialValues: data,
    validationSchema: billingInfoValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Billing Infos',
              link: '/billing-infos',
            },
            {
              label: 'Update Billing Info',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Billing Info
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.biling_summary}
            label={'Biling Summary'}
            props={{
              name: 'biling_summary',
              placeholder: 'Biling Summary',
              value: formik.values?.biling_summary,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Invoice Amount"
            formControlProps={{
              id: 'invoice_amount',
              isInvalid: !!formik.errors?.invoice_amount,
            }}
            name="invoice_amount"
            error={formik.errors?.invoice_amount}
            value={formik.values?.invoice_amount}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('invoice_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/billing-infos')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'billing_info',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BillingInfoEditPage);

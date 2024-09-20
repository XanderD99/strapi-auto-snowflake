import { useRef } from 'react'
import { useIntl } from 'react-intl'

import { Box, Field, Flex } from '@strapi/design-system';

const Input = ({
  description,
  placeholder,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  value: initialValue = "",
  ...props
}: {
  description: any
  placeholder: string
  disabled: boolean
  error: boolean
  intlLabel: any
  labelAction: string
  name: string
  onChange(v: any): void
  value: string
}) => {
  const { formatMessage } = useIntl()
  const ref = useRef("")

  return (
    <Box>
      <Field
        id={name}
        name={name}
        hint={description && formatMessage(description)}
        error={error}
      >
        <Flex spacing={1}>
          <Flex>
            <Field.Label>{formatMessage(intlLabel)}</Field.Label>
          </Flex>
          <Field.Input
            onChange={onChange}
            labelAction={labelAction}
            placeholder={placeholder}
            disabled={true}
            required
            value={initialValue}
            ref={ref}
            readOnly
          />
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field>
    </Box>
  )
}

export default Input

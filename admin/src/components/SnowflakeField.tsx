import * as React from "react";
import { useIntl } from 'react-intl'

import { Field, Flex } from '@strapi/design-system';
import { Box } from "@strapi/design-system";
import { FieldValue, InputProps } from "@strapi/strapi/admin";


type Props = InputProps & FieldValue;

const Input = React.forwardRef<HTMLButtonElement, Props>((props, _ref) => {
  const { formatMessage } = useIntl()

  const { name, value, error, hint, labelAction, label } = props;
  console.log(props)

  return (
    <Field.Root name={name} id={name} error={error} hint={hint} required={true}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label action={labelAction}>{label}</Field.Label>

        <Field.Input
          value={value}
          placeholder={label}
          readOnly
          disabled
          required
        />
      </Flex>
    </Field.Root>
  )
});

export default Input;



// const Input = ({
//   description,
//   placeholder,
//   disabled,
//   error,
//   intlLabel,
//   labelAction,
//   name,
//   onChange,
//   value: initialValue = "",
//   ...props
// }: {
//   description: any
//   placeholder: string
//   disabled: boolean
//   error: boolean
//   intlLabel: any
//   labelAction: string
//   name: string
//   onChange(v: any): void
//   value: string
// }) => {
//   const { formatMessage } = useIntl()
//   const ref = React.useRef("")

//   return (
//     <Box>
//       <Field
//         id={name}
//         name={name}
//         hint={description}
//         error={error}
//       >
//         <Flex spacing={1}>
//           <Flex>
//             <Field.Label>{formatMessage(intlLabel)}</Field.Label>
//           </Flex>
//           <Field.Input
//             onChange={onChange}
//             labelAction={labelAction}
//             placeholder={placeholder}
//             disabled={true}
//             required
//             value={initialValue}
//             ref={ref}
//             readOnly
//           />
//           <Field.Hint />
//           <Field.Error />
//         </Flex>
//       </Field>
//     </Box>
//   )
// }

// export default Input

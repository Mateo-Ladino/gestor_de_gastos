import styled from "styled-components";

export function InputText({
  style,
  onChange,
  defaultValue,
  placeholder,
  register,
  errors,
  type = "text",
  step,
  min,
  ...props
}) {
  return (
    <Container>
      <input
        style={style}
        onChange={onChange}
        type={type}
        step={step}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...register}
        {...props}
      />
      
      {errors && (
        <p>{errors.message}</p>
      )}
    </Container>
  );
}
const Container = styled.div`
  position: relative;
  input {
    background: ${({ theme }) => theme.bgtotal};
    font-size: 16px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: solid 1px grey;
    color: ${({ theme }) => theme.text};
    outline: none;
    &:focus {
      border-bottom: none;
    }
    &::placeholder {
      color: #c8c8c8;
    }
  }
  p {
    color: #ff6d00;
    font-size: 12px;
  }
`;

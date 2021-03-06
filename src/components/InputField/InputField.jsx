import styles from "./InputField.styles.module.css";
import { useInputField } from "./useInputField.hook";

function InputField({ fieldMetaInfo, placeholder="" }) {
  const { fieldState, toggleIcon } = useInputField(fieldMetaInfo);
  return (
    <label
      className={`${styles.inputFieldWrapper}`}
      style={{ display: fieldMetaInfo?.wrapperDisplayType || "inline-block" }}
      name={fieldMetaInfo?.name ?? "No Name"}
    >
      {fieldMetaInfo?.infoText && (
        <span className={styles.inputFieldInfo}>{fieldMetaInfo.infoText}</span>
      )}
      {fieldState.optionIcon && (
        <span
          className={`${styles.inputFieldOption} material-icons-outlined`}
          onClick={(e) =>
            toggleIcon(
              e,
              fieldMetaInfo.isToggle,
              fieldMetaInfo.optionIcon,
              fieldMetaInfo.toggleIcon
            )
          }
        >
          {fieldState.optionIcon}
        </span>
      )}
      <input
        className={`p-sm ${styles.inputField}`}
        name={fieldMetaInfo?.name ?? "No Name"}
        type={fieldState?.inputType ?? "text"}
        placeholder={fieldMetaInfo?.placeholderText ?? placeholder}
        autoComplete="off"
      />
    </label>
  );
}

export { InputField };

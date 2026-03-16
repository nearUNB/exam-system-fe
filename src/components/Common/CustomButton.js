import "./CustomButton.css";

export default function CustomButton({
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, className].join(" ").trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

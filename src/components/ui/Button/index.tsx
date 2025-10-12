import clsx from "clsx";

type ButtonVariants = "default" | "ghost" | "danger" | "upload";
type ButtonSizes = "sm" | "md" | "lg";

type ButtonProps = {
	variant?: ButtonVariants;
	size?: ButtonSizes;
} & React.ComponentProps<"button">;

export function Button({
	variant = "default",
	size = "md",
	...props
}: ButtonProps) {
	const buttonVariants: Record<ButtonVariants, string> = {
		default: clsx(
			"bg-blue-600 hover:bg-blue-700 text-blue-100",
			"dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white",
		),
		ghost: clsx(
			"bg-slate-200 hover:bg-slate-300 text-slate-900",
			"dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100",
		),
		danger: clsx(
			"bg-red-600 hover:bg-red-700 text-red-100",
			"dark:bg-red-500 dark:hover:bg-red-600",
		),
		upload: clsx(
			"bg-blue-50 hover:bg-blue-100",
			"border-2 border-blue-200 hover:border-blue-300 disabled:border-slate-200",
			"text-blue-700 hover:text-blue-800",
			"dark:bg-blue-900/20 dark:hover:bg-blue-900/30",
			"dark:border-blue-800/50 dark:hover:border-blue-700/50 dark:disabled:border-slate-700",
			"dark:text-blue-300 dark:hover:text-blue-200",
		),
	};

	const sizeClasses: Record<ButtonSizes, string> = {
		sm: clsx(
			"text-xs/tight",
			"py-1 px-2",
			"rounded-sm",
			"[&>svg]:w-3 [&>svg]:h-3",
			"gap-1",
		),
		md: clsx(
			"text-base/tight",
			"py-3 px-5",
			"rounded-md",
			"[&>svg]:w-4 [&>svg]:h-4",
			"gap-2",
		),
		lg: clsx(
			"text-lg/tight",
			"py-4 px-6",
			"rounded-lg",
			"[&>svg]:w-5 [&>svg]:h-5",
			"gap-3",
		),
	};

	const buttonClasses = clsx(
		buttonVariants[variant],
		sizeClasses[size],
		"flex items-center justify-center cursor-pointer",
		"transition",
		"disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400",
		"dark:disabled:bg-slate-800 dark:disabled:text-slate-600",
		props.className,
	);

	return <button {...props} className={buttonClasses} />;
}



interface Props{
    label: string
    onPress: () => void
    style?: string
}
export default function Button({label, onPress, style}: Props) {
    return (
        <button className={`${style} hover:cursor-pointer p-1.5 bg-green-500 px-7 rounded-md font-mono`} 
            onClick={onPress}
        >
            {label}
        </button>
    )
}

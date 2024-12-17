export interface IAuthButtonProps {
    handlePress: () => void;
    title: String;
    isLoading: boolean;
}

export interface IAuthFormProps {
    username: string;
    otp: string;
}

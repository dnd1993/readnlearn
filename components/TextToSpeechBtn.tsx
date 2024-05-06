import { IconButton, Tooltip } from '@chakra-ui/react';
import { MdVolumeUp } from 'react-icons/md';

type TextToSpeechBtnProps = {
    text: string,
    language: string
}

const TextToSpeechBtn = ({ text, language }: TextToSpeechBtnProps) => {
    const playTextToSpeech = (textToSpeech: string, language: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(textToSpeech);
        utterance.lang = `${language}-${language.toUpperCase()}`;
        synth.speak(utterance);
    }
    return (
        <Tooltip label='Click to hear the text' hasArrow placement='bottom'>
            <IconButton
                icon={<MdVolumeUp />}
                onClick={() => playTextToSpeech(text, language)}
                variant='ghost'
                size='lg'
                colorScheme='blue'
                aria-label='Listen'
            />
        </Tooltip>
    )
}

export default TextToSpeechBtn;
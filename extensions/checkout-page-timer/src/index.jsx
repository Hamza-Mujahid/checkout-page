import React, { useEffect, useState } from 'react';
import {
  render,
  BlockStack,
  Text,
  useSettings,
  View
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {
    timer_before_text,
    timer_after_text,
    timer,
    timer_ends,
    timer_text_color,
    timer_text_size,
    timer_size,
    timer_color
  } = useSettings();

  const calculateEndTime = (timer) => {
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + timer * 60000); // Convert minutes to milliseconds

    return endTime;
  };

  const getRemainingTimeInSeconds = (endTime) => {
    const currentTime = new Date();
    const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000);

    return remainingTimeInSeconds >= 0 ? remainingTimeInSeconds : 0;
  };

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {

    const endTime = calculateEndTime(timer); // Set the timer to 15 minutes
    setSeconds(getRemainingTimeInSeconds(endTime));

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval); // Stop the timer
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formattedTime = React.useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [seconds]);


  return (
    <BlockStack
      border="base"
      borderRadius="base"
      padding="tight"
      spacing="loose"
      blockAlignment="center"
      cornerRadius="loose"
      overflow="hidden"
      inlineAlignment="center"
    >
      <View>
        <Text size={timer_text_size} appearance={timer_text_color} emphasis="strong">
          {timer_before_text}
        </Text>
        {seconds > 0 ? (
          <Text size={timer_size} emphasis="strong" appearance={timer_color}>
            {formattedTime}
          </Text>
        ) : (
          <Text size={timer_size} appearance={timer_color} emphasis="strong">
            {timer_ends}
          </Text>
        )}
        <Text size={timer_text_size} appearance={timer_text_color} emphasis="strong">
          {timer_after_text}
        </Text>
      </View>
    </BlockStack>
  );
}

export default App;
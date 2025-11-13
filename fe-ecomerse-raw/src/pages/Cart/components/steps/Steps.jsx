import Stepper from '@/pages/Cart/components/steps/Stepper';
import styles from '../../styles.module.scss';
import { useContext } from 'react';
import { StepperContext } from '@/contexts/SteperProvider';

function Steps() {
  const { containerSteps, steps, line, textNoti } = styles;
  const { currentStep } = useContext(StepperContext);

  const dataSteps = [
    { number: 1, content: 'Shopping cart' },
    { number: 2, content: 'Checkout' },
    { number: 3, content: 'Order status' },
  ];

  return (
    <div className={containerSteps}>
      <div className={steps}>
        {dataSteps.map((item, index) => {
          return (
            <>
              <Stepper
                number={item.number}
                content={item.content}
                key={index}
                isDisabled={index >= currentStep}
              />
              {index !== dataSteps.length - 1 && <div className={line}></div>}
            </>
          );
        })}
      </div>

      <div className={textNoti}>
        You are out of time! Checkout now to avoid losing your order!
      </div>
    </div>
  );
}

export default Steps;

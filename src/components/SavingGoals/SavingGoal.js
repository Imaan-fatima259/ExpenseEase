import './SavingGoal.css';
import SavingsGoalList from './SavingsGoalList';
import { useGlobalContext } from '../../context/globalContext';


const SavingGoals = () => {
  const {profile} = useGlobalContext();

  return (
    <div>
      {
        profile?.plan === 'premium' ?(
          <SavingsGoalList />

        ): (
           <div className="premium-message">
          <h2>This is a premium feature only.</h2>
          <p>Upgrade to a premium plan to set your saving goals.</p>
        </div>
        )
      }
</div>
  );
};

export default SavingGoals;
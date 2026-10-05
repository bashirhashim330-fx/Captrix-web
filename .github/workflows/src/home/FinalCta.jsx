import { Arrow } from './icons.jsx';

const FinalCta = ({ onChoose, onLogin }) => (
  <section className="pb-[clamp(72px,9vw,128px)]" aria-labelledby="final-cta-title">
    <div className="h-container">
      <div className="h-cta px-6 py-14 sm:px-12 sm:py-20 text-center">
        <h2 id="final-cta-title" className="h-h2 max-w-2xl mx-auto">Ready to Enter The Corridor?</h2>
        <p className="h-body h-lead mt-4 max-w-xl mx-auto">
          Select your capital allocation, pass the structured risk objectives, and start receiving your profit split.
        </p>
        <div className="mt-9 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center justify-center gap-3">
          <button type="button" onClick={onChoose} className="h-btn h-btn--primary h-btn--lg">Choose your challenge <Arrow /></button>
          <button type="button" onClick={onLogin} className="h-btn h-btn--secondary h-btn--lg">Log in</button>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCta;

/**
 * The living reference — every token and component of the Phosphor Console theme
 * on one scrolling page, rebuilt from design-system.html with real Material UI.
 */
import { Shell } from '../components/Shell';
import { Masthead } from '../components/Masthead';
import { Footer } from '../components/Footer';
import { Foundations } from '../sections/Foundations';
import { Atoms } from '../sections/Atoms';
import { FormControls } from '../sections/FormControls';
import { DataDisplay } from '../sections/DataDisplay';
import { Feedback } from '../sections/Feedback';
import { Navigation } from '../sections/Navigation';
import { Patterns } from '../sections/Patterns';
import { Additions } from '../sections/Additions';

export function DesignSystemPage() {
  return (
    <Shell>
      <Masthead />
      <Foundations />
      <Atoms />
      <FormControls />
      <DataDisplay />
      <Feedback />
      <Navigation />
      <Patterns />
      <Additions />
      <Footer />
    </Shell>
  );
}

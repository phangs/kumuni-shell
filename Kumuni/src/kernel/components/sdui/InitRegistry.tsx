import React from 'react';
import { registerComponent } from './SDUIRegistry';
import DashboardHeader from './components/DashboardHeader';
import WalletCard from './components/WalletCard';
import HeroBanner from './components/HeroBanner';
import ServicesGrid from './components/ServicesGrid';
import BusinessSection from './components/BusinessSection';
import GenericGridSection from './components/GenericGridSection';
import SuppliersSection from './components/SuppliersSection';
import CommunitySection from './components/CommunitySection';
import EngagementSection from './components/EngagementSection';
import MarketplaceHeader from './components/MarketplaceHeader';
import CategoryCarousel from './components/CategoryCarousel';
import ShopCardCarousel from './components/ShopCardCarousel';
import PromosSection from './components/PromosSection';
import FeaturedSection from './components/FeaturedSection';
import TrustSection from './components/TrustSection';
import CommunitySupportCard from './components/CommunitySupportCard';
import SectionDivider from './components/SectionDivider';
import OnboardingSlide from './components/OnboardingSlide';
import AppWelcomeScreen from './components/AppWelcomeScreen';
import SDUIIcon from './components/SDUIIcon';
import HelpCenterScreen from '../HelpCenterScreen';
import { SDUIContainer, SDUIScrollView, SDUIText, SDUIButton, SDUIInput, SDUIHeading, SDUIImage, SDUIDatePicker } from './components/Atoms';

export const initRegistry = () => {
    // Atoms
    registerComponent('container', SDUIContainer);
    registerComponent('scrollview', SDUIScrollView);
    registerComponent('text', SDUIText);
    registerComponent('Text', SDUIText); // Alias
    registerComponent('button', SDUIButton);
    registerComponent('Button', SDUIButton); // Alias
    registerComponent('Input', SDUIInput);
    registerComponent('text-input', SDUIInput); // Alias
    registerComponent('textarea', SDUIInput); // Alias (handled by multiline prop)
    registerComponent('heading', SDUIHeading);
    registerComponent('image', SDUIImage);
    registerComponent('icon', SDUIIcon);
    registerComponent('date-picker', SDUIDatePicker);

    // Sections
    registerComponent('DashboardHeader', DashboardHeader);
    registerComponent('WalletCard', WalletCard);
    registerComponent('HeroBanner', HeroBanner);
    registerComponent('ServicesGrid', ServicesGrid);
    registerComponent('BusinessSection', BusinessSection);
    registerComponent('GenericGridSection', GenericGridSection);
    registerComponent('SuppliersSection', SuppliersSection);
    registerComponent('CommunitySection', CommunitySection);
    registerComponent('EngagementSection', EngagementSection);
    registerComponent('MarketplaceHeader', MarketplaceHeader);
    registerComponent('CategoryCarousel', CategoryCarousel);
    registerComponent('ShopCardCarousel', ShopCardCarousel);
    registerComponent('PromosSection', PromosSection);
    registerComponent('FeaturedSection', FeaturedSection);
    registerComponent('TrustSection', TrustSection);
    registerComponent('CommunitySupportCard', CommunitySupportCard);
    registerComponent('SectionDivider', SectionDivider);
    registerComponent('OnboardingSlide', OnboardingSlide);
    registerComponent('AppWelcomeScreen', AppWelcomeScreen);
    registerComponent('HelpCenter', (props) => (
        <HelpCenterScreen onBack={() => props.onAction?.('@popPage', {})} />
    ));
};

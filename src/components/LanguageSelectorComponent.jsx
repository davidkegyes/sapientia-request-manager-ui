import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import './LanguageSelectorComponent.css'
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const SelectorTogle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href="#"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        <i className="fa fa-globe"></i>{" "}
        {children}
    </a>
));

export default function LanguageSelectorComponent() {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    }

    return (
        <Dropdown className="languageSelector">
            <Dropdown.Toggle as={SelectorTogle} id="dropdown-custom-components">
                {t("language")}
            </Dropdown.Toggle>
            <Dropdown.Menu >
                <Dropdown.Item as="li" onSelect={changeLanguage} eventKey="hu">{t("language", {lng: 'hu'})}</Dropdown.Item>
                <Dropdown.Item as="li" onSelect={changeLanguage} eventKey="en">{t("language", {lng: 'en'})}</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
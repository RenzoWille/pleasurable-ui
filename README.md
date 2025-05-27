# Pleasurable User Interface

Ontwerp en maak met een team voor een opdrachtgever een interface waar gebruikers blij van worden.

De instructie vind je in: [INSTRUCTIONS.md](https://github.com/fdnd-task/pleasurable-ui/blob/main/docs/INSTRUCTIONS.md)



## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- Bij Beschrijving staat kort beschreven wat voor project het is en wat je hebt gemaakt -->
<!-- Voeg een mooie poster visual toe 📸 -->
<!-- Voeg een link toe naar Github Pages 🌐-->

## De gebruiker
<!-- Bij Gebruik staat de user story, hoe het werkt en wat je er mee kan. -->

## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met JS gedaan en hoe? Misschien heb je iets met NodeJS gedaan, of heb je een framwork of library gebruikt? -->


### Loading State
Voordat het formulier wordt verzonden krijg je een loading state te zien. De opacity van de button wordt verlaagd en er komt een zandloper emoji tevoorschijn. De loading state is gecodeerd met behulp van javascript en CSS.



### Succes State
Na het verzenden van het acquisition formulier krijg je een “succes state”  te zien. Het is een apart scherm die ziet nadat je een formulier succesvol hebt ingevuld. Dit is belangrijk voor de gebruikerservaring (UX) omdat het geeft duidelijkheid en het bevestigd dat alles goed is gegaan. 

![image](https://github.com/user-attachments/assets/a028b967-26d0-4d19-a345-ca960062337a)

### Tweetalige navigatie (Engels & Arabisch)
Vanuit de navigatie kan je switchen van een Engelse site naar een Arabische site. Op de homepage kan je vervolgens een artobject kiezen. De informatie van het artobject wordt in het arabisch opgehaald vanuit de database. Als er geen informatie beschikbaar wordt een default tekst weergegeven. Vanuit het artobject kan je ervoor kiezen een formulier in te vullen. De bezoeker kan het formulier invullen als de bezoeker een artobject wil verkopen of verdere informatie heeft over een bepaald artobject. Dit formulier kan zowel in het arabisch als engels worden ingevuld. 

De taalswitch wordt via de backend uitgevoerd. De juiste taalversie van de content wordt op basis van de URL geladen (bijvoorbeeld /en/object/:id/ of /ar/object/:id/). De Express-route vangt het :lang-deel van de URL op en geeft het door aan de parameter in de URL. In de Liquid-template wordt vervolgens bepaald welke vertalingen getoond worden:

``` LIQUID.JS
{% if lang == 'en' %}
  <h1>{{ artwork.title }}</h1>
  <p>{{ artwork.summary }}</p>
{% elsif lang == 'ar' %}
  <h1>{{ artwork.titleAR }}</h1>
  <p>{{ artwork.summaryAR }}</p>
{% else %}
  <p>Language not supported</p>
{% endif %}
```



## Installatie
<!-- Bij Instalatie staat hoe een andere developer aan jouw repo kan werken -->

## Bronnen

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).

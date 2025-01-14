-- Inserting data into LocationType table
INSERT INTO LocationType (Category)
VALUES
('Restaurants'),
('Bars'),
('Diners'),
('Pubs'),
('Breweries'),
('Cafés'),
('Grill Houses'),
('Steakhouses'),
('Italian Restaurants'),
('Deli & Taverns');

-- Inserting data into Location table
INSERT INTO Location (LocationName, LocationDescription, GoogleMapEmbed, LocationTypeID)
VALUES
('Brothers Bar & Grill', 'A modernized bar and restaurant with a relaxed social hangout vibe.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d775675.8434799778!2d-106.13212959999998!3d40.5861138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694b9989781235%3A0x63e84d043f713e87!2sBrothers%20Bar%20%26%20Grill!5e0!3m2!1sen!2sus!4v1733268789096!5m2!1sen!2sus', 2),
('Road 34 Deli & Tavern', 'A deli and tavern offering a variety of sandwiches and beers in a fun atmosphere.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3030.515268541087!2d-105.10087932330991!3d40.57438047141464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694a4621a5368d%3A0xe7012076212f53f1!2sRoad%2034%20Deli%20%26%20Tavern!5e0!3m2!1sen!2sus!4v1733268879642!5m2!1sen!2sus', 3),
('Big Als Burgers and Dogs', 'A popular burger and hot dog joint known for its fresh, never frozen ingredients.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.92469525762!2d-105.07812949999999!3d40.587417599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694a8ab11e2033%3A0xc86469ed113d5fc3!2sBig%20Al&#39;s%20Burgers%20and%20Dogs!5e0!3m2!1sen!2sus!4v1733267945146!5m2!1sen!2sus', 4),
('RARE Italian', 'An Italian steakhouse offering fresh, homemade pasta and dry-aged steaks.', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.9540542283607!2d-105.07992342330941!3d40.58676957141272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87694af535d2c1c9%3A0x9fa6c4c94a4c4df7!2sRARE%20Italian!5e0!3m2!1sen!2sus!4v1733268330932!5m2!1sen!2sus', 5);

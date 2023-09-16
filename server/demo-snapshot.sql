--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    contacts_id integer NOT NULL,
    notes character varying(255),
    first_name character varying(50) NOT NULL,
    last_name character varying(50),
    email character varying(255),
    phone character varying(30),
    address1 character varying(100),
    address2 character varying(50),
    city character varying(50),
    state character varying(30),
    zip integer,
    categories character varying(100),
    photo_url character varying(255),
    photo_filename character varying(255),
    photo_mimetype character varying(50),
    photo_upload_time timestamp without time zone,
    user_id character varying(255),
    CONSTRAINT first_name_not_empty CHECK (((first_name)::text <> ''::text))
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_contacts_id_seq OWNER TO postgres;

--
-- Name: contacts_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_contacts_id_seq OWNED BY public.contacts.contacts_id;


--
-- Name: group_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_contacts (
    group_id integer NOT NULL,
    contacts_id integer NOT NULL
);


ALTER TABLE public.group_contacts OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    group_id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    group_name character varying(255) NOT NULL,
    cover_picture text,
    about_text text
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_group_id_seq OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_group_id_seq OWNED BY public.groups.group_id;


--
-- Name: contacts contacts_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN contacts_id SET DEFAULT nextval('public.contacts_contacts_id_seq'::regclass);


--
-- Name: groups group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN group_id SET DEFAULT nextval('public.groups_group_id_seq'::regclass);


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (contacts_id, notes, first_name, last_name, email, phone, address1, address2, city, state, zip, categories, photo_url, photo_filename, photo_mimetype, photo_upload_time, user_id) FROM stdin;
11	Young Goat	Alexander	The Great	alexthegreat@gmail.com	1799743422	1000 Egypt cir.	pryamid 3	Egypt	Egypt	10101	The Greatest	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1687929552/Touch_Base/1687929551594-Patricio_Notion_Avatar_Black_BG.png.png	Patricio_Notion_Avatar_Black_BG.png	image/png	2023-06-27 22:19:12.887	\N
1	Developer	Patricio	Salazar	psebastiansalazar@gmail.com	8185355976	1101 Woodrow Ln.	#35	Medford	Oregon	97504	Creator	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1687929943/Touch_Base/1687929942455-Patricio_Notion_Avatar_Light_Blue_Square_BG.png.png	Patricio_Notion_Avatar_Light_Blue_Square_BG.png	image/png	2023-06-27 22:25:43.437	\N
10	KIDS	Curioso	Jorge	curiosojorge@pbskids.org	4067294844	4973 Alabama St.		Nueva York	Nueva York	93374	PBS	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1687920005/Touch_Base/1687920004480-notion_avatar__2.svg.png	notion_avatar__2.svg	image/svg+xml	2023-06-27 19:40:11.389	\N
12	He pickled the Beast	Benny the Jet	Rodriguez	Bennythejet@sandlot.com	1284957433	1995 Sandlot ave.		Austin	Texas	29044	PF Flyer	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1688100197/Touch_Base/1688100196704-Patricio_Notion_Avatar_Gray_Square_BG.png.png	Patricio_Notion_Avatar_Gray_Square_BG.png	image/png	2023-06-29 21:43:17.751	\N
7	A World of Pure Imagination	Willy	Wonka	willywonka@chocolatefactory.com	1234567809	0000 Chocolate Factory rd.	null	Portland	OR	11		https://res.cloudinary.com/dpyx8fkzs/image/upload/v1688101751/Touch_Base/1688101750818-Notion_Avatar_Comb_Over_Gray_Round_BG.png.png	Notion_Avatar_Comb_Over_Gray_Round_BG.png	image/png	2023-06-29 22:09:12.186	\N
15	Skywalker family	Darth	Vader	dvader@sithcounsel.com	0000000000	41 BBY		Outer Rim Territories	Tatooine	22112	The Force	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1688627532/Touch_Base/1688627531667-Notion_Avatar_Comb_Over_Green_BG.png.png	Notion_Avatar_Comb_Over_Green_BG.png	image/png	2023-07-06 00:12:12.469	uV0eqIYeoNO9lZB8xC5YDBkVipK2
16	Whatever	Some	User	someuser@example.com	99482495u2948	sdlkad09990		loopy City	Caddd	987	Makeshift	https://res.cloudinary.com/dpyx8fkzs/image/upload/v1688678570/Touch_Base/1688678569971-notion_avatar_transparent__2.svg.png	notion_avatar_transparent__2.svg	image/svg+xml	2023-07-06 14:22:52.144	Xtzq0PNQZtNzg20tbfwTlRvXCam1
37		Andrew	Davis	andavisv88@hotmail.com	916-454-9635	161 Park Avenue		Sacramento	CA	95817		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900193000-andrew-power-y9L5-wmifaY-unsplash.jpg	1694900193000-andrew-power-y9L5-wmifaY-unsplash.jpg	image/jpeg	2023-09-16 14:36:34.156	h8j3g6KvbsSXNBjyEysqAawGbJy2
36		Carlos	Gonzales	csgonzales90@gmail.com	310-709-0333	1007 Jett Lane		Burbank	CA	91504		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900411143-carlos-gil-GfuvYM8LPPQ-unsplash.jpg	1694900411143-carlos-gil-GfuvYM8LPPQ-unsplash.jpg	image/jpeg	2023-09-16 14:40:12.121	h8j3g6KvbsSXNBjyEysqAawGbJy2
20		Deborah	Kline	deborahlorenkline@gmail.com	404-751-8919	3524 Despard Street		Chamblee	GA	30341	Fictional Dude	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900483879-tony-luginsland-OswNOXPNU1k-unsplash.jpg	1694900483879-tony-luginsland-OswNOXPNU1k-unsplash.jpg	image/jpeg	2023-09-16 14:41:24.562	h8j3g6KvbsSXNBjyEysqAawGbJy2
32		Donald	Morrow	donaldmorrow.pauc@hotmail.com	256-331-7934	4008 Turnpike Drive		Calumet	MI	49913		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900501742-foto-sushi-6anudmpILw4-unsplash.jpg	1694900501742-foto-sushi-6anudmpILw4-unsplash.jpg	image/jpeg	2023-09-16 14:41:42.712	h8j3g6KvbsSXNBjyEysqAawGbJy2
33		Harold	Ramis	ramisrh@gmail.com	518-594-0517	4926 Oak Drive		Ellenburg Depot	NY	12935		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900544650-foto-sushi-ocOW8-uiAjk-unsplash.jpg	1694900544650-foto-sushi-ocOW8-uiAjk-unsplash.jpg	image/jpeg	2023-09-16 14:42:25.77	h8j3g6KvbsSXNBjyEysqAawGbJy2
14		Jan	Wenger	jwenger@gmail.com	863-784-1794	3590 Ethels Lane		Avion Park	FL	33825	Celebrity	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900579750-jason-moyer-A73ah5JKtVA-unsplash.jpg	1694900579750-jason-moyer-A73ah5JKtVA-unsplash.jpg	image/jpeg	2023-09-16 14:43:00.505	h8j3g6KvbsSXNBjyEysqAawGbJy2
31		Joshua	Drum	drummerjosh@gmail.com	818-812-4216	4482 Koontz Lane		Los Angeles	CA	90017		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900613333-tyler-nix-ZGa9d1a_4tA-unsplash.jpg	1694900613333-tyler-nix-ZGa9d1a_4tA-unsplash.jpg	image/jpeg	2023-09-16 14:43:33.972	h8j3g6KvbsSXNBjyEysqAawGbJy2
24		Lindsay	Black	lkarineblack@yahoo.com	925-389-5992	4169 Park Street		Concord	CA	94520	Founder	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900636303-clay-elliot-mpDV4xaFP8c-unsplash.jpg	1694900636303-clay-elliot-mpDV4xaFP8c-unsplash.jpg	image/jpeg	2023-09-16 14:43:57.325	h8j3g6KvbsSXNBjyEysqAawGbJy2
30		Nicholas	Bolster	nichbolster@gmail.com	843-622-0832	1856 Khale Street		Chesterfield	SC	29709		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900657728-petr-sevcovic-auCjz0gucr0-unsplash.jpg	1694900657728-petr-sevcovic-auCjz0gucr0-unsplash.jpg	image/jpeg	2023-09-16 14:44:18.996	h8j3g6KvbsSXNBjyEysqAawGbJy2
17		Reyna	Elliott	reyna.hermaverna@hotmail.com	203-610-7205	4218 Whitman Court		New Haven	CT	16511	Fictional Dude	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900696965-michael-dam-mEZ3PoFGs_k-unsplash.jpg	1694900696965-michael-dam-mEZ3PoFGs_k-unsplash.jpg	image/jpeg	2023-09-16 14:44:57.525	h8j3g6KvbsSXNBjyEysqAawGbJy2
21		Ruth	Chase	ruthchase@hotmail.com	440-794-5035	1570 Harley Vincent Drive		Cleveland	OH	44115	Fictional Dude	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900709879-christina-wocintechchat-com-SJvDxw0azqw-unsplash.jpg	1694900709879-christina-wocintechchat-com-SJvDxw0azqw-unsplash.jpg	image/jpeg	2023-09-16 14:45:11.219	h8j3g6KvbsSXNBjyEysqAawGbJy2
23		Sara	Endicott	sara.endicott@gmail.com	850-487-3062	3511 Morgan Street		Tallahassee	FL	32301	Fictional Dude	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900729539-christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.jpg	1694900729539-christina-wocintechchat-com-0Zx1bDv5BNY-unsplash.jpg	image/jpeg	2023-09-16 14:45:30.89	h8j3g6KvbsSXNBjyEysqAawGbJy2
25		Valorie	Bressler	valorie.schaef@yahoo.com	402-565-8805	1569 Commerce Boulevard		Hoskins	NE	68740	OG	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900787342-karsten-winegeart-bwDnRf-r4u8-unsplash.jpg	1694900787342-karsten-winegeart-bwDnRf-r4u8-unsplash.jpg	image/jpeg	2023-09-16 14:46:28.244	h8j3g6KvbsSXNBjyEysqAawGbJy2
35		William	McCullough	williammccullough8@gmail.com	209-245-2041	3352 Maple Avenue		Plymouth	CA	95669		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694901753746-taylor-grote-UiVe5QvOhao-unsplash%20%281%29.jpg	1694901753746-taylor-grote-UiVe5QvOhao-unsplash (1).jpg	image/jpeg	2023-09-16 15:02:34.924	h8j3g6KvbsSXNBjyEysqAawGbJy2
34		Amir	Taghi	amirtaghi@gmail.com	707-697-4976	3944 Davis Avenue		Oakland	CA	94612		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902004343-willian-souza-p5BoBF0XJUA-unsplash.jpg	1694902004343-willian-souza-p5BoBF0XJUA-unsplash.jpg	image/jpeg	2023-09-16 15:06:45.435	h8j3g6KvbsSXNBjyEysqAawGbJy2
19		Darla	Thompson	dar.lehne4@gmail.com	706-366-7118	2485 Davis Street		Columbus	GA	31901	Marvel	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900442685-tony-luginsland-ZAo0cKz_IKM-unsplash.jpg	1694900442685-tony-luginsland-ZAo0cKz_IKM-unsplash.jpg	image/jpeg	2023-09-16 14:40:43.645	h8j3g6KvbsSXNBjyEysqAawGbJy2
28		Gregory	Hodges	gleoniehodges@hotmail.com	812-869-6145	1213 Stratford Park		Seymour	IL	47274		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900515527-josh-scorpio-H3Tuh0hwYQk-unsplash.jpg	1694900515527-josh-scorpio-H3Tuh0hwYQk-unsplash.jpg	image/jpeg	2023-09-16 14:41:56.78	h8j3g6KvbsSXNBjyEysqAawGbJy2
29		James	Harris	jkaleharris@yahoo.com	731-501-4628	1653 Melville Street		Memphis	TN	38141		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900558605-ryan-hoffman-v7Jja2ChN6s-unsplash.jpg	1694900558605-ryan-hoffman-v7Jja2ChN6s-unsplash.jpg	image/jpeg	2023-09-16 14:42:39.761	h8j3g6KvbsSXNBjyEysqAawGbJy2
18		Janice	Sampson	J.willis.sampson@gmail.com	407-437-1392	3292 Stoneybrook Road		Orlando	FL	32805	Fictional Chick	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900596637-alexandra-lowenthal-vO3NGxiJSgU-unsplash.jpg	1694900596637-alexandra-lowenthal-vO3NGxiJSgU-unsplash.jpg	image/jpeg	2023-09-16 14:43:17.847	h8j3g6KvbsSXNBjyEysqAawGbJy2
26		Sharon	Markowitz	smarkowitz@hotmail.com	914-574-4860	4405 Mount Tabor		Westbury	NY	11590		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900746707-alex-starnes-WYE2UhXsU1Y-unsplash.jpg	1694900746707-alex-starnes-WYE2UhXsU1Y-unsplash.jpg	image/jpeg	2023-09-16 14:45:47.4	h8j3g6KvbsSXNBjyEysqAawGbJy2
22		Tanya	Olson	Tanya1989@gmail.com	215-845-3591	988 Glen Falls Road		Philadelphia	PA	19103	Fictional Dude	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900760649-christina-wocintechchat-com-Zpzf7TLj_gA-unsplash.jpg	1694900760649-christina-wocintechchat-com-Zpzf7TLj_gA-unsplash.jpg	image/jpeg	2023-09-16 14:46:01.342	h8j3g6KvbsSXNBjyEysqAawGbJy2
27		Wayne	Johnson	waynejohnson@yahoo.com	773-355-0371	2633 Oakmound Drive		Chicago	IL	60605		https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694900804197-linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg	1694900804197-linkedin-sales-solutions-pAtA8xe_iVM-unsplash.jpg	image/jpeg	2023-09-16 14:46:45.173	h8j3g6KvbsSXNBjyEysqAawGbJy2
\.


--
-- Data for Name: group_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_contacts (group_id, contacts_id) FROM stdin;
1	31
1	34
1	35
1	36
1	30
6	23
6	25
6	18
6	36
6	37
6	30
7	23
7	37
7	36
7	35
7	22
7	17
7	24
7	28
7	18
7	29
7	31
7	14
7	25
7	27
7	34
7	33
8	37
8	34
8	30
8	26
8	17
8	24
9	17
9	23
9	35
9	33
9	28
9	22
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (group_id, user_id, group_name, cover_picture, about_text) FROM stdin;
8	h8j3g6KvbsSXNBjyEysqAawGbJy2	Book Club	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902514738-alexander-wende-IQuzsQv_bO4-unsplash.jpg	Every Wednesday
9	h8j3g6KvbsSXNBjyEysqAawGbJy2	RUN	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902560570-steven-lelham-atSaEOeE8Nk-unsplash%20%281%29.jpg	Running squad
6	h8j3g6KvbsSXNBjyEysqAawGbJy2	Small Group	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902578651-toa-heftiba-l_ExpFwwOEg-unsplash.jpg	Church group
7	h8j3g6KvbsSXNBjyEysqAawGbJy2	Birthday Party	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902595822-nikhita-singhal-k8y9HrzonOQ-unsplash%20%281%29.jpg	35!!!!
1	h8j3g6KvbsSXNBjyEysqAawGbJy2	Guys Night	https://touch-base-bucket.s3.us-west-2.amazonaws.com/1694902625172-joshua-aragon-KDWRyoHUlvo-unsplash.jpg	Legends doing legendary things
\.


--
-- Name: contacts_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_contacts_id_seq', 52, true);


--
-- Name: groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_group_id_seq', 16, true);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (contacts_id);


--
-- Name: group_contacts group_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_contacts
    ADD CONSTRAINT group_contacts_pkey PRIMARY KEY (group_id, contacts_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: group_contacts group_contacts_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_contacts
    ADD CONSTRAINT group_contacts_contact_id_fkey FOREIGN KEY (contacts_id) REFERENCES public.contacts(contacts_id);


--
-- Name: group_contacts group_contacts_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_contacts
    ADD CONSTRAINT group_contacts_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


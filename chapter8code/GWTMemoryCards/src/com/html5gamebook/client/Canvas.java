package com.html5gamebook.client;

import com.google.code.gwt.html5.media.client.Audio;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.HasClickHandlers;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.Timer;
import com.hydro4ge.raphaelgwt.client.Raphael;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;


/**
 * Created by IntelliJ IDEA.
 * User: jwill
 * Date: 11/20/10
 * Time: 11:54 AM
 */
public class Canvas extends Raphael {
    static JSONObject transparent = new JSONObject();
    static JSONObject opaque = new JSONObject();
    static CardSet selectedCards = new CardSet();

    Deck deck;
    int numCards = 6;
    int matchesFound;
    Path loop;
    ArrayList<Card> cardArray = new ArrayList<Card>();

    Audio sndFlipCard, sndShuffle, sndWin;

    public Canvas(final int width, final int height) {
        super(width, height);

        transparent.put("opacity", new JSONNumber(0.0d));
        opaque.put("opacity", new JSONNumber(1.0d));


        deck = new Deck(1);
    }

    void loadAudio() {
        if (!Audio.canPlayType("audio/ogg; codecs=vorbis").trim().equals("")) {
            sndFlipCard = new Audio("/Game/sounds/flipcard.ogg");
            sndShuffle = new Audio("/Game/sounds/cardshuffle.ogg");
            sndWin = new Audio("/Game/sounds/fanfare.ogg");
        } else {
            sndFlipCard = new Audio("/Game/sounds/flipcard.mp3");
            sndShuffle = new Audio("/Game/sounds/cardshuffle.mp3");
            sndWin = new Audio("/Game/sounds/fanfare.mp3");
        }
    }

    @Override
    public void onLoad() {
        super.onLoad();
         // Initialize game sounds
        loadAudio();

        Rect gameboard = new Rect(0, 0, 720, 805, 15);
        JSONObject attr = new JSONObject();
        attr.put("fill", new JSONString("#090"));
        attr.put("stroke", new JSONString("#000"));

        gameboard.attr(attr);
        gameboard.toBack();

        Text gameTitle = new Text(300,30, "Card Match Game");
        gameTitle.attr("font-size", 48);
        gameTitle.attr("font-weight", "bold");
        gameTitle.attr("fill","#FFF");
        gameTitle.attr("stroke",2);

        List<Card> c = Arrays.asList(deck.dealCards(numCards));
        cardArray.addAll(c);
        // Copy of each card
        for (Card card : c) {
            cardArray.add(card.clone());
        }


        // Shuffle the cards
        cardArray = deck.shuffle(cardArray);

        // Card positions
        int xOffset = 169;
        int yOffset = 245;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 4; j++) {
                int k = (i * 4) + j;
                Card card = cardArray.get(k);
                card.meta.put("pos", k);

                card.xPos = j * xOffset + 20;
                card.yPos = i * yOffset + 50;
            }
        }

        // draw


        // Draw cards
        for (int i = 0; i < 12; i++) {
            cardArray.get(i).drawCard();
        }

        loop = new Path(win_path);
        loop.attr("stroke", 0);

        sndShuffle.play();
    }

    void flipAllCards() {
        Card card = (Card) selectedCards.get(0);
        Card card2 = (Card) selectedCards.get(1);
        card.flipCard();
        card2.flipCard();
    }

    void endGame() {
        sndWin.play();
        Text youwin = new Text(150,400, "You win!");
        youwin.toFront();
        youwin.attr("fill", "white");
        youwin.attr("font-size", 40);
        youwin.animateAlong(loop, 3000);
    }

    public class RImage extends Image implements HasClickHandlers {
        public RImage(String src, double x, double y, double width, double height) {
            super(src, x, y, width, height);
        }

        public HandlerRegistration addClickHandler(ClickHandler handler) {
            return this.addDomHandler(handler, ClickEvent.getType());
        }
    }

    class Card extends Set {
        HashMap meta = new HashMap();
        boolean isHidden;
        String ord, suit;
        int xPos, yPos;
        boolean frontShown;

        RImage cardFront, cardBack;
        String cardFrontPath;
        String cardBackPath;
        // 90 dpi height and width
        int cardWidth = 169;
        int cardHeight = 245;

        public Card(String ordinal, String suit) {
            super();
            ord = ordinal;
            this.suit = suit;
            cardBackPath = "Game/images/90dpi/back.png";
            cardFrontPath = "Game/images/90dpi/" + ord + "_" + suit + ".png";

        }

        public void drawCard() {
            cardBack = new RImage(cardBackPath, xPos, yPos, cardWidth, cardHeight);
            cardFront = new RImage(cardFrontPath, xPos, yPos, cardWidth, cardHeight);
            cardFront.attr(transparent);
            setupHandlers();
        }

        void setupHandlers() {
            ClickHandler handler = new ClickHandler() {
                public void onClick(ClickEvent e) {
                    flipCard();
                    GWT.log("flipped");
                    if (selectedCards.size() == 2) {
                        Timer t = new Timer() {
                            public void run() {
                                checkForMatch((Card) selectedCards.get(0));
                            }
                        };
                        t.schedule(1000);
                    }
                }
            };
            cardFront.addClickHandler(handler);
            cardBack.addClickHandler(handler);
        }

        void checkForMatch(Card card2) {
            if (this.shallowEquals(card2)) {
                this.discard();
                card2.discard();

                matchesFound++;
                GWT.log("Matches:" + matchesFound);
                selectedCards = new CardSet();
            } else {
                Timer t = new Timer() {
                    public void run() {
                        flipAllCards();
                    }
                };

                t.schedule(1000);
            }
            GWT.log(selectedCards.toString());
            if (matchesFound == numCards) {
                endGame();
            }
        }

        public void flipCard() {
            if (isHidden) {
                return;
            }

            frontShown = !frontShown;

            if (frontShown) {
                cardBack.animate(transparent, 1000);
                cardFront.animate(opaque, 1000);
                selectedCards.add(this);
            } else {
                cardBack.animate(opaque, 1000);
                cardFront.animate(transparent, 1000);
                selectedCards.remove(this);
            }
            sndFlipCard.play();
            GWT.log(selectedCards.toString());
        }

        void discard() {
            cardFront.animate(transparent, 1000, "bounce");
            isHidden = true;
        }

        public boolean shallowEquals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            Card card = (Card) o;

            if (ord != null ? !ord.equals(card.ord) : card.ord != null) return false;
            if (suit != null ? !suit.equals(card.suit) : card.suit != null) return false;

            return true;
        }

        // Generated code

        @Override
        public String toString() {
            return "Card{" +
                    "ord='" + ord + '\'' +
                    ", suit='" + suit + '\'' +
                    '}';
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            Card card = (Card) o;

            if (meta != card.meta) return false;
            if (ord != null ? !ord.equals(card.ord) : card.ord != null) return false;
            if (suit != null ? !suit.equals(card.suit) : card.suit != null) return false;

            return true;
        }

        @Override
        public int hashCode() {
            int result = (isHidden ? 1 : 0);
            result = 31 * result + (ord != null ? ord.hashCode() : 0);
            result = 31 * result + (suit != null ? suit.hashCode() : 0);
            return result;
        }

        public Card clone() {
            return new Card(this.ord, this.suit);
        }
    }

    class Deck {
        int numDecks = 1;
        ArrayList<Card> cards;

        public Deck(int numDecks) {
            this.numDecks = numDecks;
            cards = new ArrayList<Card>();
            initCards();
        }

        void initCards() {
            String[] ordinals = new String[]{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king" };
            String[] suits = new String[]{"club", "spade", "heart", "diamond" };

            // Populate card array
            for (int k = 0; k < numDecks; k++) {
                for (int j = 0; j < suits.length; j++) {
                    for (int i = 0; i < ordinals.length; i++) {
                        cards.add(new Card(ordinals[i], suits[j]));
                    }
                }
            }

            // Shuffle the decks
            shuffleDecks();
        }

        void swap(int i, int j) {
            Card temp = cards.get(j);
            cards.set(j, cards.get(i));
            cards.set(i, temp);
        }

        void shuffleDecks() {
            for (int j = 0; j < numDecks; j++) {
                for (int i = (numDecks * 51); i >= 0; i--) {
                    int r = (int) Math.floor(Math.random() * i);
                    swap(i, r);
                }
            }

        }

        public ArrayList<Card> shuffle(ArrayList<Card> array) {
            ArrayList<Card> result = (ArrayList<Card>) array.clone();
            for (int i = 0; i < result.size(); i++) {
                int j = i;
                while (j == i) {
                    j = (int) Math.floor(Math.random() * result.size());
                }
                Card temp = result.get(i);
                result.set(i, result.get(j));
                result.set(j, temp);
            }
            return result;
        }

        public Card dealCard() {
            if (cards.size() > 0)
                return cards.remove(0);
            else {
                initCards();
                return cards.remove(0);
            }
        }

        public Card[] dealCards(int num) {
            Card[] cards = new Card[num];
            for (int i = 0; i < num; i++) {
                cards[i] = dealCard();
            }
            return cards;
        }

    }

    String win_path = "m84,284c0,-2 -0.38268,-3.07611 0,-4c0.5412,-1.30655 0.23463,-2.15225 1,-4c0.5412,-1.30655 1,-3 1,-5c0,-2 0,-4 0,-6c0,-2 0,-5 0,-8c0,-2 0.49346,-3.87856 1,-7c0.32037,-1.97418 0.49346,-3.87856 1,-7c0.32037,-1.97418 0.4588,-3.69344 1,-5c0.38268,-0.92387 0.48626,-1.82375 1,-4c0.22975,-0.97325 0.77025,-2.02675 1,-3c0.51374,-2.17625 1.77025,-3.02675 2,-4c0.51374,-2.17625 1.69255,-4.186 3,-6c0.8269,-1.14726 2.1731,-2.85274 3,-4c1.30745,-1.814 3.34619,-2.70546 5,-5c1.30745,-1.814 2.70546,-3.34619 5,-5c1.814,-1.30745 3.31001,-1.33749 6,-3c1.203,-0.7435 3.09789,-2.82443 5,-4c1.7013,-1.05147 5,-2 7,-3c2,-1 3.59399,-2.513 6,-4c2.68999,-1.66251 6.07843,-1.78986 9,-3c2.06586,-0.85571 5.03874,-1.51945 8,-2c3.12144,-0.50655 6.02582,-1.67964 8,-2c3.12144,-0.50655 5.82375,-1.48625 8,-2c2.91975,-0.68925 6,0 9,0c3,0 5,0 9,0c3,0 5,0 7,0c4,0 6,0 9,0c3,0 5,0 7,0c2,0 4.82375,1.48625 7,2c1.9465,0.4595 3.0535,0.5405 5,1c2.17625,0.51375 3.0535,1.5405 5,2c2.17625,0.51375 3,1 5,2c2,1 4.04291,1.71022 5,2c3.45085,1.04483 5.01291,2.83981 6,3c3.12144,0.50655 4.87856,2.49345 8,3c0.98709,0.16019 3,1 4,2c1,1 3,2 4,3c1,1 2.1731,1.85274 3,3c1.30746,1.814 2,3 4,5c1,1 2.70547,3.34619 5,5c1.814,1.30745 6.186,2.69255 8,4c2.29453,1.65381 3.37201,2.3851 7,5c2.29453,1.65381 4,3 6,5c1,1 4.41885,2.41885 6,4c1.58115,1.58115 3.61383,3.297 6,6c1.47983,1.67633 4,4 5,5c3,3 4.81265,5.2068 7,7c2.78833,2.28587 4,3 6,5c1,1 3,3 5,5c1,1 1.69254,2.186 3,4c1.65381,2.29453 3,3 5,5c1,1 2.34619,2.70547 4,5c1.30746,1.814 3.1731,3.85272 4,5c1.30746,1.814 2.19028,3.88153 4,7c1.12234,1.93399 2.69254,3.186 4,5c1.65381,2.29453 4.82443,2.0979 6,4c0.52573,0.85065 2.85272,3.1731 4,4c1.814,1.30746 2.85272,1.1731 4,2c1.814,1.30746 2.82376,1.48627 5,2c0.97324,0.22977 2,0 3,0c1,0 2,0 3,0c1,0 2,0 4,0c1,0 2.0535,-0.5405 4,-1c2.17624,-0.51373 4,-2 6,-3c2,-1 3.88153,-2.19028 7,-4c1.93399,-1.12234 3.59399,-3.513 6,-5c2.69,-1.66251 4.61105,-1.92807 7,-4c1.68924,-1.46509 2.74673,-3.37134 7,-6c1.9021,-1.17557 2,-2 5,-5c1,-1 1.56723,-3.28326 3,-5c3.20374,-3.83875 5,-5 6,-7c1,-2 3.19028,-6.88153 5,-10c1.12234,-1.93399 3.56952,-6.133 5,-10c0.77579,-2.09717 3.27432,-7.88496 4,-10c1.65482,-4.82303 1,-7 1,-8c0,-3 1,-6 1,-9c0,-2 0,-6 0,-8c0,-1 -0.23462,-4.15224 -1,-6c-0.5412,-1.30656 -1.2565,-2.797 -2,-4c-1.66251,-2.68999 -2.14935,-3.47427 -3,-4c-1.9021,-1.17557 -1.69345,-3.4588 -3,-4c-0.92389,-0.38269 -1.69345,-1.4588 -3,-2c-0.92389,-0.38269 -5.186,-0.69255 -7,-2c-1.14728,-0.8269 -6,-1 -10,-1c-3,0 -10,0 -13,0c-3,0 -11.04132,1.84723 -15,3c-6.07233,1.76826 -9.23532,3.36955 -18,7c-4.13171,1.71141 -8.21921,3.5329 -15,7c-5.19165,2.65456 -7.86325,5.1468 -10,7c-3.77728,3.27602 -6.74182,5.32718 -13,10c-2.88904,2.15718 -5.81265,4.2068 -8,6c-5.57666,4.57176 -9.03986,6.92398 -11,8c-5.11145,2.80591 -7.0979,3.82443 -9,5c-4.25327,2.62866 -6.95328,4.07193 -10,6c-4.92722,3.1181 -7.12704,3.67862 -10,5c-5.29749,2.43651 -6,4 -9,6c-3,2 -4.76108,3.41589 -8,5c-2.84073,1.38934 -6.07278,2.8819 -11,6c-3.04672,1.92807 -6.50424,2.03552 -11,5c-2.36128,1.55704 -5.0883,1.75238 -11,4c-7.11862,2.70651 -12.37422,2.94138 -25,8c-4.15134,1.66327 -8.17488,3.58786 -18,8c-4.07967,1.83203 -13.10701,4.08099 -17,5c-4.35251,1.0275 -9.87856,4.49347 -13,5c-0.98709,0.16019 -6.0034,1.91751 -7,2c-6.06204,0.50171 -7.87856,1.49347 -11,2c-2.96126,0.48056 -5,0 -9,0c-1,0 -3,0 -5,0c-2,0 -5.01291,0.16019 -6,0c-3.12144,-0.50653 -4.31001,-0.33749 -7,-2c-1.203,-0.7435 -1.82375,-1.48627 -4,-2c-0.97325,-0.22977 -2.82375,-1.48627 -5,-2c-0.97325,-0.22977 -2.07612,-0.61731 -3,-1c-1.30656,-0.5412 -2.07612,-1.61731 -3,-2c-1.30656,-0.5412 -1.61732,-1.07611 -2,-2c-0.5412,-1.30655 -2,-2 -3,-3c-1,-1 -1.29289,-1.29291 -2,-2c-0.70711,-0.70709 -1.4588,-0.69345 -2,-2c-0.38268,-0.92389 -0.61732,-1.07611 -1,-2c-0.5412,-1.30655 -1.61732,-2.07611 -2,-3c-0.5412,-1.30655 -1,-2 -2,-3l-1,-1l0,-1";

    /**/
}

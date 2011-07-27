package com.html5gamebook.client;


import java.util.ArrayList;

import com.html5gamebook.client.Canvas.Card;

/**
 * Created by IntelliJ IDEA.
 * User: jwill
 * Date: 11/20/10
 * Time: 2:09 PM
 */
public class CardSet {
    private ArrayList<Card> rawArray = new ArrayList<Card>();
    public void add(Card card) {
        if (rawArray.contains(card) != true) {
            rawArray.add(card);
        }
    }

    public Card get(int index) {
        return rawArray.get(index);
    }

    public void remove(Card card) {
        rawArray.remove(card);
    }

    public int size() {
        return rawArray.size();
    }



    @Override
    public String toString() {
        return "CardSet{" +
                "rawArray=" + rawArray +
                '}';
    }
}

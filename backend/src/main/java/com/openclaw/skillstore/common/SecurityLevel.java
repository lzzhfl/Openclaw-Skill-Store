package com.openclaw.skillstore.common;

public enum SecurityLevel {
    S("Exceptional"),
    A("Excellent"),
    B("Good"),
    C("Adequate"),
    D("Basic");

    private final String label;

    SecurityLevel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

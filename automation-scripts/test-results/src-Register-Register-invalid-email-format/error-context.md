# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - heading "Register" [level=2] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - text: Username
        - generic [ref=e8]: "*"
      - textbox "Username *" [ref=e9]: Sonal
    - generic [ref=e10]:
      - generic [ref=e11]:
        - text: Email
        - generic [ref=e12]: "*"
      - textbox "Email *" [ref=e13]: sonal
    - generic [ref=e14]:
      - generic [ref=e15]:
        - text: Password
        - generic [ref=e16]: "*"
      - textbox "Password *" [ref=e17]: Test@1234
    - button "Register" [active] [ref=e18] [cursor=pointer]
    - paragraph [ref=e20]:
      - text: Already have an account?
      - link "Sign in" [ref=e21] [cursor=pointer]:
        - /url: /login
  - alert [ref=e22]:
    - img [ref=e24]
    - generic [ref=e26]: Username already exists
    - button "Close" [ref=e28] [cursor=pointer]:
      - img [ref=e29] [cursor=pointer]
```
;; SIP-009 Arcus Token Contract

;; Constants
(define (decimals) 6)  ; 6 decimal places
(define (name) "Arcus Token") ; Token Name
(define (symbol) "ABR") ; Token Symbol
(define (total-supply) 1000000000) ; Total Token Supply

;; Data Variables
(define-data-var balances (map address uint))
(define-data-var total-supply uint)
(define-data-var allowance ((map address (map address uint))))

;; Functions
(define-public (balance-of (owner address)) uint
  (map-get? balances owner (uint 0)))

(define-public (allowance (owner address) (spender address)) uint
  (map-get? (map-get? allowance owner (default {})) spender (uint 0)))

(define-public (transfer (to address) (amount uint)) bool
  (begin
    (assert (> amount 0) "Amount must be greater than zero")
    (let ((sender tx-sender)
          (sender-balance (balance-of tx-sender)))
      (assert (>= sender-balance amount) "Not enough balance to transfer")
      (map-set balances sender (- sender-balance amount))
      (map-set balances to (+ (balance-of to) amount))
      true)))

(define-public (approve (spender address) (amount uint)) bool
  (begin
    (assert (> amount 0) "Amount must be greater than zero")
    (let ((sender tx-sender))
      (map-set (map-get? allowance sender (default {})) spender amount)
      true)))

(define-public (transfer-from (from address) (to address) (amount uint)) bool
  (begin
    (assert (> amount 0) "Amount must be greater than zero")
    (let ((sender tx-sender)
          (sender-balance (balance-of from))
          (sender-allowance (allowance from sender)))
      (assert (>= sender-balance amount) "Not enough balance to transfer")
      (assert (>= sender-allowance amount) "Not enough allowance to transfer")
      (map-set balances from (- sender-balance amount))
      (map-set balances to (+ (balance-of to) amount))
      (map-set (map-get? allowance from (default {})) sender (- sender-allowance amount))
      true)))

(define-read-only (get-name) (name))
(define-read-only (get-symbol) (symbol))
(define-read-only (get-decimals) (decimals))
(define-read-only (get-total-supply) (total-supply))

;; Send Loan to Bitcoin Reserve, Withdraw from Bitcoin Reserve

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-money (err u50))
(define-constant err-owner-cannot-be-user (err u51))
(define-constant err-invalid-address (err u1))

;; data maps and vars
(define-data-var bridge-money int 21)
(define-map user-balance principal int)
(define-map user-reserves principal (buff 20)) ;; maps user addresses to their Bitcoin Reserve addresses
;; (define-data-var stacks-to-btc-map (map (key (buff 20)) (value (buff 20))))

;; This function creates a Bitcoin Reserve for the user
(define-public (create-reserve (reserve-address (buff 20)))
  (begin
    (map-set user-reserves tx-sender reserve-address)
    (ok "Bitcoin Reserve created successfully")
  )
)



;; This function deposits sBTC from user's wallet to their Bitcoin Reserve
(define-public (deposit (amount uint))
  (begin
    (asserts! (is-some (map-get? user-reserves tx-sender)) "Bitcoin Reserve not created for user")
    (let ((reserve-address (unwrap-panic (map-get? user-reserves tx-sender))))
      (ft-transfer? self amount (unwrap-principal reserve-address) self-token-contract-id))
    (ok "Deposit successful")
  )
)


;; This function withdraws sBTC from Bitcoin Reserve to user's wallet
(define-public (withdraw (amount int))
  (begin
    (asserts! (is-some (map-get? user-reserves tx-sender)) "Bitcoin Reserve not created for user")
    (ft-transfer? (unwrap-panic (map-get? user-reserves tx-sender)) amount tx-sender self-token-contract-id)
    (ok "Withdrawal successful")
  )
)

;; This function adds a user to the system
(define-public (add-user (address principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (not (is-eq address contract-owner)) err-owner-cannot-be-user)
    (map-set user-balance address 0)
    (map-set user-reserves address (tuple (buff 20))) ;; initialize Bitcoin Reserve with a tuple containing a 20-byte buffer
    (ok "User added successfully")
  )
)



;; maps a Stacks address to a Bitcoin address
(define-public (map-addresses (stacks-address (buff 20)) (btc-address (buff 20)))
  (begin
    (map-set stacks-to-btc-map stacks-address btc-address)
    (ok "Addresses mapped successfully")
  )
)

;; retrieves the Bitcoin address mapped to a given Stacks address
(define-public (get-btc-address (stacks-address (buff 20)))
  (begin
    (map-get? stacks-to-btc-map stacks-address)
  )
)

;; This function sends tokens as a loan to a user
(define-public (send-loan (receiver-address principal) (amount int))
(begin
(asserts! (is-eq tx-sender contract-owner) err-owner-only)
(asserts! (>= (var-get bridge-money) amount) err-not-enough-money)
(asserts! (<= (unwrap-panic (map-get? user-balance receiver-address)) amount) err-not-enough-money)
(map-set user-balance receiver-address (+ (unwrap-panic (map-get? user-balance receiver-address)) amount))
(var-set bridge-money (- (var-get bridge-money) amount))
(ok "Loan sent successfully")
)
)

;; This function allows a user to take a loan
(define-public (take-loan (from-address principal) (amount int))
(begin
(asserts! (is-eq tx-sender contract-owner) err-owner-only)
(asserts! (>= (unwrap-panic (map-get? user-balance from-address)) amount) err-not-enough-money)
(map-set user-balance from-address (- (unwrap-panic (map-get? user-balance from-address)) amount))
(var-set bridge-money (+ (var-get bridge-money) amount))
(ok "Loan taken successfully")
)
)

;; This function returns the user balance
(define-public (get-user-balance (address principal))
(ok (unwrap-panic (map-get? user-balance address)))
)

;;This function returns the total token balance
(define-read-only (get-token-balance)
(var-get bridge-money)
)

;; This function withdraws sbtc from Bitcoin Reserve into user's wallet
(define-public (withdraw-sbtc (amount uint) (user-principal principal))
(begin
(asserts! (is-eq tx-sender contract-owner) err-owner-only)
(asserts! (>= (var-get bridge-money) amount) err-not-enough-money)
(let ((user-balance (map-get? user-balance user-principal)))
(map-set user-balance user-principal (+ amount user-balance))
(var-set bridge-money (- (var-get bridge-money) amount))
(ok "Withdrawal successful")
)
)
)

;; This function deposits sbtc to the Bitcoin Reserve
(define-public (deposit-sbtc (amount uint))
(begin
(asserts! (>= (stx-get-balance tx-sender) amount) err-not-enough-money)
(map-set user-balance tx-sender (- (unwrap-panic (map-get? user-balance tx-sender)) amount))
(var-set bridge-money (+ (var-get bridge-money) amount))
(ok "Deposit successful")
)
)

;; This function gets the user's balance in the Bitcoin Reserve
(define-public (get-user-reserve-balance (user-principal principal))
(unwrap-panic (map-get? user-balance user-principal))
)
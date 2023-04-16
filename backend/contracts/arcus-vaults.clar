;; TODO: invest in strats; ABR vault, sbtc/sabr, sbtc/susdt, sbtc/alex

;; ABR Vault

;; constants
(define-constant token-contract (contract-address "ABR-CONTRACT")) ;; address of the ABR token contract
(define-constant apy-percentage 10) ;; the annual percentage yield the user earns
(define-constant seconds-per-week (* 7 24 60 60)) ;; the number of seconds in a week

;; data maps and vars
(define-map pool-balance principal uint) ;; the amount of ABR tokens locked up in the pool
(define-map pool-expiry principal uint) ;; the timestamp when a user's tokens can be withdrawn
(define-data-var pool-total uint 0) ;; the total number of ABR tokens in the pool
(define-data-var pool-start-timestamp uint (now)) ;; the timestamp when the pool was created

;; deposit function
(define-public (deposit (amount uint))
  (begin
    (asserts! (> amount 0) "Deposit amount must be greater than 0")
    (let* ((sender (get-principal (get-caller)))
           (balance (ft-balance token-contract sender)))
      (asserts! (>= balance amount) "Insufficient balance to deposit")
      (ft-transfer token-contract amount self)
      (map-set pool-balance sender (+ (unwrap-panic (map-get? pool-balance sender)) amount))
      (map-set pool-expiry sender (+ (now) seconds-per-week))
      (var-set pool-total (+ (var-get pool-total) amount))
      (ok "Deposit successful")))
)

;; withdraw function
(define-public (withdraw)
  (begin
    (let ((sender (get-principal (get-caller))))
      (asserts! (is-some (map-get? pool-expiry sender)) "No tokens deposited")
      (asserts! (>= (unwrap-panic (map-get? pool-expiry sender)) (now)) "Tokens not yet available for withdrawal")
      (let* ((balance (unwrap-panic (map-get? pool-balance sender)))
             (apy (div (mul balance apy-percentage) 5200)) ;; 52 weeks in a year, APY compounded weekly
             (total (var-get pool-total))
             (fee (div (mul balance 10) 1000))) ;; 1% withdrawal fee
        (ft-transfer self (- balance fee) sender)
        (map-set pool-balance sender 0)
        (map-set pool-expiry sender 0)
        (var-set pool-total (- total balance))
        (ft-transfer token-contract fee self)
        (ok (concat "Withdrawal successful. APY earned: " (u64->string apy)))))))

;; get balance function, check user's deposited balance in the vault
(define-public (get-balance)
  (let ((sender (get-principal (get-caller))))
    (unwrap-panic (map-get? pool-balance sender))))

;;returns the total amount of ABR tokens deposited in the vault
(define-public (get-total-balance)
  (var-get pool-total))

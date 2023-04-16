;; Simple ABR Faucet Contract

;; Constants
(define-constant (withdrawal-amount) 10) ;; Amount of ABR tokens users can withdraw
(define-constant (withdrawal-interval) (* 24 60 60)) ;; Time interval between withdrawals (24 hours)

;; Data Variables
(define-data-var last-withdrawal (map address uint))

;; Functions
(define-public (withdraw)
  (let* ((sender (get-caller))
         (last-withdrawal-timestamp (map-get? last-withdrawal sender 0))
         (time-since-last-withdrawal (- (now) last-withdrawal-timestamp)))
    (assert (> time-since-last-withdrawal withdrawal-interval) "You must wait 24 hours between withdrawals")
    (map-set last-withdrawal sender (now))
    (transfer sender withdrawal-amount)
    true))
